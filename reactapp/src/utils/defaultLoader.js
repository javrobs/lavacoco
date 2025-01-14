
const defaultLoader = async (loaderName) => {
    const response = await fetch(`/api/${loaderName}_info`);
    const data = await response.json()
    return data;
}


export default defaultLoader;