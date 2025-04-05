export const getGeneri = () => {
    return async (dispatch) => {
        try {
            const response = await fetch("http://192.168.1.65:5220/api/Generi", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwtToken"),
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                dispatch({
                    type: "GET_GENERI",
                    payload: data.generi,
                });
            } else {
                throw new Error("Errore nella response di getGeneri");
            }
        } catch (error) {
            console.error("ERRORE FETCH:" + error);
        }
    };
};

export const postGeneri = (nome, navigate) => {
    return async (dispatch) => {
        try {
            const response = await fetch("http://192.168.1.65:5220/api/Generi", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwtToken"),
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    nome: nome,
                }),
            });
            if (response.ok) {
                dispatch(getGeneri())
                navigate("/artisti")
            } else {
                const text = await response.text();
                let message = "Errore.";

                const errorData = text ? JSON.parse(text) : null;
                if (errorData?.message) {
                    message = errorData.message;
                }

                dispatch({ type: "GENERI_ERROR", payload: message });
                throw new Error(message);
            }
        }
        catch (error) {
            console.error("ERRORE FETCH:" + error);
        }
    };
};

export const putGeneri = (
    nome
) => {
    return async (dispatch) => {
        try {
            const response = await fetch(
                "http://192.168.1.65:5220/api/Generi/genere?nome=" + encodeURIComponent(nome),
                {
                    method: "PUT",
                    body: JSON.stringify({
                        nome: nome,
                    }),
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("jwtToken"),
                        "Content-type": "application/json; charset=UTF-8",
                    },
                }
            );
            if (response.ok) {
                dispatch(getGeneri());
            } else {
                throw new Error("errore nella putGeneri");
            }
        } catch (error) {
            console.error("ERRORE:", error);
        }
    };
};

export const deleteGenere = (nome) => {
    return async (dispatch) => {
        try {
            const response = await fetch("http://192.168.1.65:5220/api/Generi/genere?nome=" + encodeURIComponent(nome), {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwtToken"),
                },
            });
            if (response.ok) {
                dispatch(getGeneri());
            } else throw new Error("errore nella deleteGenere");
        } catch (error) {
            console.error("ERRORE:", error);
        }
    };
};