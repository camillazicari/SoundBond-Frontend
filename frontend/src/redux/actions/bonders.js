import { deleteRichiesta } from "./richieste";

export const getBonders = () => {
    return async (dispatch) => {
        try {
            const response = await fetch("http://192.168.1.61:5220/api/Bonders", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwtToken"),
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                dispatch({
                    type: "GET_BONDERS",
                    payload: data.bonders,
                });
            } else {
                throw new Error("Errore nella response di getBonders");
            }
        } catch (error) {
            console.error("ERRORE FETCH:" + error);
        }
    };
};

export const postBonder = (id) => {
    return async (dispatch) => {
        try {
            const response = await fetch("http://192.168.1.61:5220/api/Bonders", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwtToken"),
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    userId2: id
                }),
            });
            if (response.ok) {
                dispatch(getBonders());
                dispatch(deleteRichiesta(id))
            } else {
                const text = await response.text();
                let message = "Errore.";

                const errorData = text ? JSON.parse(text) : null;
                if (errorData?.message) {
                    message = errorData.message;
                }

                dispatch({ type: "BONDERS_ERROR", payload: message });
                throw new Error(message);
            }
        } catch (error) {
            console.error("ERRORE FETCH:" + error);
        }
    };
};

export const deleteBonder = (id) => {
    return async (dispatch) => {
        try {
            const response = await fetch(
                "http://192.168.1.61:5220/api/Bonders?id=" + id,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("jwtToken"),
                    },
                }
            );
            if (response.ok) {
                dispatch(getBonders());
            } else throw new Error("errore nella deleteBonder");
        } catch (error) {
            console.error("ERRORE:", error);
        }
    };
};
