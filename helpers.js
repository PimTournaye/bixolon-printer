function stripHTML(data) {
    let strippedString = data.replace(/(<([^>]+)>)/gi, "");
    
    return strippedString;
}