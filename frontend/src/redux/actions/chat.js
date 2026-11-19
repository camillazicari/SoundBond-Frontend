import { API_URL } from "../../config";
export const getConversazioni = () => {
    return async (dispatch) => {
        try {
            const response = await fetch(`${API_URL}/api/Messages/conversazioni`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwtToken"),
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                dispatch({
                    type: "GET_CONVERSAZIONI",
                    payload: data,
                });
            } else {
                throw new Error("Errore nella response di getConversazioni");
            }
        } catch (error) {
            console.error("ERRORE FETCH:" + error);
        }
    };
};