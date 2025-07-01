export const getRichiesteInviate = () => {
    return async (dispatch) => {
        try {
            const response = await fetch("http://192.168.1.63:5220/api/Richiesta/inviate", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwtToken"),
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                dispatch({
                    type: "GET_RICHIESTE_INVIATE",
                    payload: data.richiesteInviate,
                });
            } else {
                throw new Error("Errore nella response di getRichiesteInviate");
            }
        } catch (error) {
            console.error("ERRORE FETCH:" + error);
        }
    };
};

export const getRichiesteRicevute = () => {
    return async (dispatch) => {
        try {
            const response = await fetch("http://192.168.1.63:5220/api/Richiesta/ricevute", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwtToken"),
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                dispatch({
                    type: "GET_RICHIESTE_RICEVUTE",
                    payload: data.richiesteRicevute,
                });
            } else {
                throw new Error("Errore nella response di getRichiesteRicevute");
            }
        } catch (error) {
            console.error("ERRORE FETCH:" + error);
        }
    };
};

export const postRichiesta = (id) => {
    return async (dispatch, getState) => {
        try {

            const state = getState();
            const senderId = state.account.userLogged?.id;

            // creo l'oggetto richiesta temporaneo
            const tempRequest = {
                id: `temp-${Date.now()}`,
                sender: { id: senderId },
                receiver: { id: id },
                status: "pending",
                isTemp: true
            };

            // Aggiornamento ottimistico IMMEDIATO
            dispatch({
                type: "ADD_RICHIESTA_INVIATA_OTTIMISTIC",
                payload: tempRequest
            });

            const response = await fetch("http://192.168.1.63:5220/api/Richiesta", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwtToken"),
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    receiverId: id
                }),
            });
            if (response.ok) {
                dispatch(getRichiesteInviate());
            } else {
                const text = await response.text();
                let message = "Errore.";

                const errorData = text ? JSON.parse(text) : null;
                if (errorData?.message) {
                    message = errorData.message;
                }
                dispatch({ type: "RICHIESTE_ERROR", payload: message });
                throw new Error(message);
            }
        } catch (error) {
            dispatch({
                type: "REMOVE_RICHIESTA_INVIATA_OTTIMISTIC",
                payload: id
            });
            console.error("ERRORE FETCH:" + error);
        }
    };
};

export const deleteRichiesta = (id) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: "REMOVE_RICHIESTA_INVIATA_OTTIMISTIC",
                payload: id
            });

            const response = await fetch(
                "http://192.168.1.63:5220/api/Richiesta?id=" + id,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("jwtToken"),
                    },
                }
            );
            if (response.ok) {
                dispatch(getRichiesteInviate());
            } else throw new Error("errore nella deleteRichiesta");
        } catch (error) {
            console.error("ERRORE:", error);
        }
    };
};
