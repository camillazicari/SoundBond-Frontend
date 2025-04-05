export const getArtisti = () => {
  return async (dispatch) => {
    try {
      const response = await fetch("http://192.168.1.65:5220/api/Artisti", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwtToken"),
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        dispatch({
          type: "GET_ARTISTI",
          payload: data.artisti,
        });
      } else {
        throw new Error("Errore nella response di getArtisti");
      }
    } catch (error) {
      console.error("ERRORE FETCH:" + error);
    }
  };
};

export const postArtisti = (nome, navigate) => {
  return async (dispatch) => {
    try {
      const response = await fetch("http://192.168.1.65:5220/api/Artisti", {
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
        dispatch(getArtisti());
        navigate("/brani");
      } else {
        const text = await response.text();
        let message = "Errore.";

        const errorData = text ? JSON.parse(text) : null;
        if (errorData?.message) {
          message = errorData.message;
        }

        dispatch({ type: "ARTISTI_ERROR", payload: message });
        throw new Error(message);
      }
    } catch (error) {
      console.error("ERRORE FETCH:" + error);
    }
  };
};

export const putArtisti = (nome) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        "http://192.168.1.65:5220/api/Artisti/artista?nome=" +
        encodeURIComponent(nome),
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
        dispatch(getArtisti());
      } else {
        throw new Error("errore nella putArtisti");
      }
    } catch (error) {
      console.error("ERRORE:", error);
    }
  };
};

export const deleteArtista = (nome) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        "http://192.168.1.65:5220/api/Artisti?nome=" + encodeURIComponent(nome),
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwtToken"),
          },
        }
      );
      if (response.ok) {
        dispatch(getArtisti());
      } else throw new Error("errore nella putArtisti");
    } catch (error) {
      console.error("ERRORE:", error);
    }
  };
};
