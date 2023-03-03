let url="https://gateway.marvel.com:443/v1/public/";
let privateKey="2bfb960a6dcdfc26cc5d114dc8b61a0eb4fa2189";
let publicKey="88cf2b13d56278fb815edae1c64a3d79";
let ts="1";
let hash=md5(ts+privateKey+publicKey);
let name;
window.onload=function(){
    document.getElementById('btn').addEventListener('click',function(){
        name=document.getElementById('nom').value;
        doRequest();
    })   


   
    const promesa1 = new Promise((resolve,reject)=>{
        setTimeout(resolve, 100, 'Hombre de Hierro');
    });
    const promesa2 = new Promise((resolve,reject)=>{
        setTimeout(resolve, 200, 'Kang el Conejo');
    });
    Promise.all([promesa1, promesa2])
    .then(([resultat1, resultat2]) => {
        console.log(resultat1+" vs "+ resultat2);
    })
    .then(()=>{
        Promise.race([promesa1, promesa2]).then((value)=> {
            console.log("Ha guanyat: "+value); 
        })
    })
    
}




function doRequest(){
    api=getURL();
    let loader = document.getElementById('loader');
    loader.style.display="block";
    fetch(api)
        .then(res =>{return res.json()})
        .then((json)=>{
            
            generarContingut(json.data.results)
        }).catch(err => console.error(err)) 
}
function getURL(){
    let api=`${url}`;
    api+='characters?&';
    if(name!=""){
        api+=`nameStartsWith=${name}&`;
    }
    api+=`limit=1&ts=${ts}&apikey=${publicKey}&hash=${hash}`;
    console.log(api)
    return api;
}
async function generarContingut(elements) {
    let personatge = elements[0];
    let comics = personatge.comics.items;
    let marvel = document.getElementById("marvel");
    marvel.innerHTML="";
    await comics.forEach(comic=>{
        fetch(comic.resourceURI+`?ts=${ts}&apikey=${publicKey}&hash=${hash}`)
            .then(res =>{return res.json()})
            .then((json)=>{
                let resposta = json.data.results[0]; 
                marvel.innerHTML += "<div class='box'>"+
                "<div class='box-front'><img src='"+resposta.thumbnail.path+"."+resposta.thumbnail.extension+"'><p>" +comic.name+ "</p></div>"+
                "<div class='box-back'><h1>Datos</h1><p>Precio: "+resposta.prices[0].price+"$</p><p> Fecha: "+resposta.dates[0].date.split("T")[0]+"</p></div></div>";
            })
            .catch(err => console.error(err))   
    })
    setTimeout((()=>{
        let marvel = document.getElementById("marvel");
        marvel.style.display="grid";
        console.log("ready")
        document.getElementById('loader').style.display="none";
        let frontBox = document.getElementsByClassName('box-front');
        let backBox = document.getElementsByClassName('box-back');
        for(let i=0;i<frontBox.length;i++){ 
            frontBox[i].addEventListener("click", (()=>{
                frontBox[i].style.display="none";
                backBox[i].style.display="flex";
                console.log("Hola"); 
            }));
        }

        for(let i=0;i<backBox.length;i++){ 
            backBox[i].addEventListener("click", (()=>{
                backBox[i].style.display="none";
                frontBox[i].style.display="block";
                console.log("Hola"); 
            }));
        }
    }),2000)
}
    


function comicRequest(URI){
    fetch(URI+`?ts=${ts}&apikey=${publicKey}&hash=${hash}`)
        .then(res =>{return res.json()})
        .then((json)=>{
            resposta=json;
        })
        .catch(err => console.error(err)) 
}