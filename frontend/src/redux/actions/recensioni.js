export const getAllRecensioni = () => {
    return async (dispatch) => {
        try {
            const response = await fetch("http://192.168.1.61:5220/api/Recensioni/recensioni", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwtToken"),
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                dispatch({
                    type: "GET_ALL_RECENSIONI",
                    payload: data.recensioni,
                });
            } else {
                throw new Error("Errore nella response di getAllRecensioni");
            }
        } catch (error) {
            console.error("ERRORE FETCH:" + error);
        }
    };
};

export const getMiaRecensione = () => {
    return async (dispatch) => {
        try {
            const response = await fetch("http://192.168.1.61:5220/api/Recensioni/recensione", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwtToken"),
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                dispatch({
                    type: "GET_MIA_RECENSIONE",
                    payload: data.recensione,
                });
            } else {
                throw new Error("Errore nella response di getMiaRecensione");
            }
        } catch (error) {
            console.error("ERRORE FETCH:" + error);
        }
    };
};

export const postRecensione = (testo, voto) => {
    return async (dispatch) => {
        try {
            const response = await fetch("http://192.168.1.61:5220/api/Recensioni", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwtToken"),
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    testo: testo,
                    voto: voto
                }),
            });
            if (response.ok) {
                dispatch(getMiaRecensione());
                return { ok: true };
            } else {
                const text = await response.text();
                let message = "Errore.";

                const errorData = text ? JSON.parse(text) : null;
                if (errorData?.message) {
                    message = errorData.message;
                }

                dispatch({ type: "RECENSIONI_ERROR", payload: message });
                throw new Error(message);
            }
        } catch (error) {
            console.error("ERRORE FETCH:" + error);
        }
    };
};

export const putRecensione = (testo, voto) => {
    return async (dispatch) => {
        try {
            const response = await fetch(
                "http://192.168.1.61:5220/api/Recensioni",
                {
                    method: "PUT",
                    body: JSON.stringify({
                        testo: testo,
                        voto: voto
                    }),
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("jwtToken"),
                        "Content-type": "application/json; charset=UTF-8",
                    },
                }
            );
            if (response.ok) {
                dispatch(getMiaRecensione());
                return { ok: true };
            } else {
                throw new Error("errore nella putRecensione");
            }
        } catch (error) {
            console.error("ERRORE:", error);
        }
    };
};

export const deleteRecensione = () => {
    return async (dispatch) => {
        try {
            const response = await fetch(
                "http://192.168.1.61:5220/api/Recensioni",
                {
                    method: "DELETE",
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("jwtToken"),
                    },
                }
            );
            if (response.ok) {
                dispatch({
                    type: "DELETE_RECENSIONE"
                });
                dispatch(getAllRecensioni());
                return { ok: true };
            } else throw new Error("errore nella deleteRecensione");
        } catch (error) {
            console.error("ERRORE:", error);
        }
    };
};
