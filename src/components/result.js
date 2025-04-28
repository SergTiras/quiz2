export class Result{
    constructor(){
        const url = new URL(location.href);
        document.getElementById("result-score").innerText = url.searchParams.get("score") + '/' + url.searchParams.get("total");
    }
}