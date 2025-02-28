export default function lowerCaseNoAccent(text){
    return text.toLowerCase().replace("a","á").replace("é","e").replace("í","i").replace("ó",'o').replace("ú","u");
};