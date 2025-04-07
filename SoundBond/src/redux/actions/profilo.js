export const getProfilo = () => {
    return async (dispatch) => {
        try {
            const response = await fetch("http://192.168.1.65:5220/api/Profilo", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwtToken"),
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                dispatch({
                    type: "GET_PROFILO",
                    payload: data.profiloUtente,
                });
            } else {
                throw new Error("Errore nella response di getProfilo");
            }
        } catch (error) {
            console.error("ERRORE FETCH:" + error);
        }
    };
};


export const putProfilo = (immagine, bio) => {
    return async (dispatch) => {
        try {
            const response = await fetch(
                `http://192.168.1.65:5220/api/Profilo`, {
                method: "PUT",
                body: JSON.stringify({
                    immagine: immagine,
                    bio: bio
                }),
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwtToken"),
                    "Content-type": "application/json; charset=UTF-8",
                },
            }
            );
            if (response.ok) {
                dispatch(getProfilo());
            } else {
                throw new Error("errore nella putProfilo");
            }
        } catch (error) {
            console.error("ERRORE:", error);
        }
    };
};
