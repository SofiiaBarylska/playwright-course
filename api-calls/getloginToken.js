import * as nodeFetch from "node-fetch"

export const getLoginToken = async (username, password) => {
    const responce = await nodeFetch("http://localhost:2221/api/login", {
        method: "POST",
        body: JSON.stringify({username: username, password: password}),
    })
    if (responce.status !== 200) {
        throw new Error("An error occured trying to retrievw the ogin token.")
    }
    const body = await responce.json()
    return body.token
}