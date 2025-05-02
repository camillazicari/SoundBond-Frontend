
export const register = (nome, cognome, email, dataDiNascita, nomeUtente, password, navigate) => {
    return async (dispatch) => {
        try {
            const response = await fetch("http://192.168.1.12:5220/api/Account/register", {
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

            const contentType = response.headers.get("Content-Type");
            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                if (response.ok) {
                    navigate("/accedi");
                } else {
                    let message = "Errore nella registrazione.";
                    if (data?.message) {
                        message = data.message;
                    }
                    dispatch({ type: "REGISTER_ERROR", payload: message });
                    throw new Error(message);
                }
            } else {
                const text = await response.text();
                console.error("Errore nella risposta del server:", text);
                throw new Error("Risposta non valida dal server");
            }
        } catch (error) {
            console.error("ERRORE FETCH:" + error);
        }
    };
};

export const login = (email, password, navigate) => {
    return async (dispatch) => {
        try {
            const response = await fetch("http://192.168.1.12:5220/api/Account/login", {
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
                localStorage.setItem("jwtToken", data.token);
                dispatch({ type: "LOGIN_SUCCESS", payload: true });
                const userResponse = await fetch("http://192.168.1.12:5220/api/Account/userLogged", {
                    headers: {
                        Authorization: "Bearer " + data.token,
                        "Content-Type": "application/json",
                    },
                });

                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    const user = userData.user;

                    dispatch({
                        type: "GET_USER_LOGGED",
                        payload: user,
                    });
                    const hasPreferences =
                        user.brani?.length > 0 &&
                        user.generi?.length > 0 &&
                        user.artisti?.length > 0;

                    if (hasPreferences) {
                        navigate("/");
                    } else {
                        navigate("/generi");
                    }
                } else {
                    throw new Error("Errore nella response di userLogged");
                }

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
            const response = await fetch("http://192.168.1.12:5220/api/Account/utenti", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwtToken"),
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                //console.log(data);
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

export const getAllUtenti = () => {
    return async (dispatch) => {
        try {
            const response = await fetch("http://192.168.1.12:5220/api/Account/utentiGenerali", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwtToken"),
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                //console.log(data);
                dispatch({
                    type: "GET_ALL_USERS",
                    payload: data.utenti,
                });
            } else {
                throw new Error("Errore nella response di getAllUtenti");
            }
        } catch (error) {
            console.error("ERRORE FETCH:" + error);
        }
    };
};

export const getUtente = (id) => {
    return async (dispatch) => {
        try {
            const response = await fetch("http://192.168.1.12:5220/api/Account/utente" + id, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwtToken"),
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                //console.log(data);
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

export const getUtenteLoggato = () => {
    return async (dispatch, navigate) => {
        try {
            const response = await fetch("http://192.168.1.12:5220/api/Account/userLogged", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwtToken"),
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                //console.log(data);
                dispatch({
                    type: "GET_USER_LOGGED",
                    payload: data.user,
                });
            }
            else if (response.status === 401) {
                localStorage.removeItem("jwtToken");
                dispatch({ type: "LOGOUT" });
                navigate("/homeIniziale");
            }
            else {
                throw new Error("Errore nella response di getUtenteLoggato");
            }
        } catch (error) {
            console.error("ERRORE FETCH:" + error);
        }
    };
};

export const putNomeUtente = (nomeUtente) => {
    return async (dispatch) => {
        try {
            const response = await fetch(
                "http://192.168.1.12:5220/api/Account/nomeUtente",
                {
                    method: "PUT",
                    body: JSON.stringify({
                        nuovoNomeUtente: nomeUtente
                    }),
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("jwtToken"),
                        "Content-type": "application/json; charset=UTF-8",
                    },
                }
            );
            if (response.ok) {
                dispatch(getUtenteLoggato());
            } else {
                throw new Error("errore nella response di putNomeUtente");
            }
        } catch (error) {
            console.error("ERRORE:", error);
        }
    };
};


export const deleteUtente = (navigate) => {
    return async () => {
        try {
            const response = await fetch("http://192.168.1.12:5220/api/Account/utente", {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwtToken"),
                },
            });
            if (response.ok) {
                navigate("/homeIniziale")
            } else throw new Error("errore nella response di deleteUtente");
        } catch (error) {
            console.error("ERRORE:", error);
        }
    };
};