export const getBrani = () => {
    return async (dispatch) => {
        try {
            const response = await fetch("http://192.168.1.59:5220/api/Brani", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwtToken"),
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                dispatch({
                    type: "GET_BRANI",
                    payload: data.brani,
                });
            } else {
                throw new Error("Errore nella response di getBrani");
            }
        } catch (error) {
            console.error("ERRORE FETCH:" + error);
        }
    };
};

export const postBrani = (titolo, artista, img) => {
    return async (dispatch) => {
        try {
            const response = await fetch("http://192.168.1.59:5220/api/Brani", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwtToken"),
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    titolo: titolo,
                    artista: artista,
                    img: img
                }),
            });
            if (response.ok) {
                dispatch(getBrani());
            } else {
                const text = await response.text();
                let message = "Errore.";

                const errorData = text ? JSON.parse(text) : null;
                if (errorData?.message) {
                    message = errorData.message;
                }

                dispatch({ type: "BRANI_ERROR", payload: message });
                throw new Error(message);
            }
        } catch (error) {
            console.error("ERRORE FETCH:" + error);
        }
    };
};

export const putBrani = (titolo, artista, img) => {
    return async (dispatch) => {
        try {
            const response = await fetch(
                `http://192.168.1.59:5220/api/Brani/titolo/${encodeURIComponent(titolo)}/artista/${encodeURIComponent(artista)}`, {
                method: "PUT",
                body: JSON.stringify({
                    titolo: titolo,
                    artista: artista,
                    img: img
                }),
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwtToken"),
                    "Content-type": "application/json; charset=UTF-8",
                },
            }
            );
            if (response.ok) {
                dispatch(getBrani());
            } else {
                throw new Error("errore nella putBrani");
            }
        } catch (error) {
            console.error("ERRORE:", error);
        }
    };
};

export const deleteBrano = (titolo, artista) => {
    return async (dispatch) => {
        try {
            const response = await fetch(
                `http://192.168.1.59:5220/api/Brani/titolo/${encodeURIComponent(titolo)}/artista/${encodeURIComponent(artista)}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("jwtToken"),
                    },
                }
            );
            if (response.ok) {
                dispatch(getBrani());
            } else throw new Error("errore nella deleteBrano");
        } catch (error) {
            console.error("ERRORE:", error);
        }
    };
};
