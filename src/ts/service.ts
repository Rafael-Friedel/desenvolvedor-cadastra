const serverUrl = "http://localhost:5000";

export const getProducts = async () => {
  try {
    const response = await fetch(serverUrl + "/products");

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
  }
};
