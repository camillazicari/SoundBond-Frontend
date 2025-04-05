export const register = (nome, cognome, email, dataDiNascita, nomeUtente, password, navigate) => {
    return async (dispatch) => {
        try {
            const response = await fetch("http://192.168.1.65:5220/api/Account/register", {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    nome: nome,
                    cognome: cognome,
                    email: email,
                    dataDiNascita: dataDiNascita,
                    nomeUtente: nomeUtente,
                    password: password,
                }),
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                navigate("/accedi")
            } else {
                const text = await response.text();
                let message = "Errore nella registrazione.";

                const errorData = text ? JSON.parse(text) : null;
                if (errorData?.message) {
                    message = errorData.message;
                }

                dispatch({ type: "REGISTER_ERROR", payload: message });
                throw new Error(message);
            }
        }
        catch (error) {
            console.error("ERRORE FETCH:" + error);
        }
    };
};

export const login = (email, password, navigate) => {
    return async (dispatch) => {
        try {
            const response = await fetch("http://192.168.1.65:5220/api/Account/login", {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                localStorage.setItem("jwtToken", data.token);
                dispatch({ type: "LOGIN_SUCCESS", payload: true });
                navigate("/home")
            } else {
                dispatch({ action: "LOGIN_ERROR", payload: "Email o password errati." })
                throw new Error("Errore nella response di login");
            }
        } catch (error) {
            console.error("ERRORE FETCH:" + error);
        }
    };
};

export const getUtenti = () => {
    return async (dispatch) => {
        try {
            const response = await fetch("http://192.168.1.65:5220/api/Account/utenti", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwtToken"),
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                dispatch({
                    type: "GET_USERS",
                    payload: data.utenti,
                });
            } else {
                throw new Error("Errore nella response di getUtenti");
            }
        } catch (error) {
            console.error("ERRORE FETCH:" + error);
        }
    };
};

export const getUtente = (id) => {
    return async (dispatch) => {
        try {
            const response = await fetch("http://192.168.1.65:5220/api/Account/utente" + id, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwtToken"),
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                dispatch({
                    type: "GET_USER",
                    payload: data.utente,
                });
            } else {
                throw new Error("Errore nella response di getUtente");
            }
        } catch (error) {
            console.error("ERRORE FETCH:" + error);
        }
    };
};

export const deleteUtente = (navigate) => {
    return async () => {
        try {
            const response = await fetch("http://192.168.1.65:5220/api/Account/utente", {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwtToken"),
                },
            });
            if (response.ok) {
                navigate("/")
            } else throw new Error("errore nella deleteUtente");
        } catch (error) {
            console.error("ERRORE:", error);
        }
    };
};