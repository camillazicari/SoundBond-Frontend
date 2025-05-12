export const postProfilo = () => {
    return async (dispatch) => {
        try {
            const response = await fetch("http://192.168.1.61:5220/api/Profilo", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwtToken"),
                    "Content-Type": "application/json",
                },
                method: "POST",
            });
            if (response.ok) {
                dispatch(getProfilo())
            } else {
                const text = await response.text();
                let message = "Errore.";

                const errorData = text ? JSON.parse(text) : null;
                if (errorData?.message) {
                    message = errorData.message;
                }

                throw new Error(message);
            }
        }
        catch (error) {
            console.error("ERRORE FETCH:" + error);
        }
    };
};

export const getProfilo = () => {
    return async (dispatch) => {
        try {
            const response = await fetch("http://192.168.1.61:5220/api/Profilo", {
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


export const putProfilo = (formdata) => {
    return async (dispatch) => {
        try {
            const response = await fetch(
                `http://192.168.1.61:5220/api/Profilo`, {
                method: "PUT",
                body: formdata,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwtToken"),
                },
            });

            if (response.ok) {
                dispatch(getProfilo());
                return true;
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error("Server responded with:", response.status, errorData);
                throw new Error(errorData.message || "Errore nella putProfilo");
            }
        } catch (error) {
            console.error("ERRORE:", error);
            throw error;
        }
    };
};
