
const defaultLoader = async (loaderName,...other) => {
    const slashes = [`${loaderName}_info`,other].join("/");
    const response = await fetch(`/api/${slashes}`);
    const data = await response.json()
    return data;
}


export default defaultLoader;