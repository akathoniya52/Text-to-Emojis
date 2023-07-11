document.getElementById('result').style.display = "none"
document.getElementById('error').style.display = "none"
document.querySelector("#encryption").style.display = "none"
// Import the functions you need from the SDKs you need

// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
// import { doc, getDoc } from "firebase/firestore";


// console.log(docSnap)
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-analytics.js";
// import firebase from "firebase/compat/app";
// Required for side-effects
// import "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyBAbCdC2RjOQVEx0qCCBgkzOfSneRk_mSw",
  authDomain: "text-to-emojis.firebaseapp.com",
  projectId: "text-to-emojis",
  storageBucket: "text-to-emojis.appspot.com",
  messagingSenderId: "1009053697122",
  appId: "1:1009053697122:web:c90f7fb2737701bbf83d3b",
  measurementId: "G-GRR3H3SBEM"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig)
// const analytics = getAnalytics(app);
const db = firebase.firestore();
// const da = await db.collection('user').doc("2").get()

// user Exist or not
async function  userExist(docID){
    console.log("userExist chala")
    const e1 = await db.collection('user').doc(""+docID).get();
    if(e1.data()===undefined){
        return false;
    }
    return true;
}

async function setData(obj, docID){

    try {
        db.collection('user').doc(""+docID).set(obj);
        console.log("successfully added")
    } catch (error) {
        console.log(error)
    }

}

async function getData(docID){
    try{
        const d1 = await db.collection('user').doc(""+docID).get()
        // console.log(d1.data())
        return d1;
    }
    catch(error){
        console.log(error)
    }
}


// script.js

let cnt = 1;



function btnClicking(){
      document.getElementById("lockopen").classList.remove("text-white")
      document.querySelector("#encryption").style.display = "none"
      document.querySelector('#decryption').style.display = "block"
      document.getElementById("dec-btn").classList.add("text-white")
      document.getElementById("enc-btn").classList.remove("text-white")
      document.getElementById("lockin").classList.add("text-white")
      
      document.getElementById("arrow").innerHTML = "&#8594;";
      document.getElementById('result').style.display = "none";
}

function dec(){
  // encryptionW
  document.getElementById("lockopen").classList.add("text-white")
  document.getElementById('error').style.display = "none"
  document.querySelector("#decryption").style.display = "none"
  document.querySelector('#encryption').style.display = "block"
  
  document.getElementById("enc-btn").classList.add("text-white")
  document.getElementById("dec-btn").classList.remove("text-white")
  document.getElementById("lockin").classList.remove("text-white")

  document.getElementById("arrow").innerHTML = "&#8592;";
  document.getElementById('result').style.display = "none"

}



function encryption(){
  // get text msg
  var v = document.getElementById('txtmsg').value;
  // console.log(v)

  var p = document.getElementById('pwd').value;
  // console.log(p);

  document.getElementById('error').classList.add("text-[red]");
  document.getElementById('error').style.display = "block"


  if(!v && !p){
    document.getElementById('error').innerHTML = "Please enter text message and password";
  }
  else if(!v){
    document.getElementById('error').innerHTML = "Please enter text message";
  }
  else if(!p){
    document.getElementById('error').innerHTML = "Please set password";
  }
  else{

    const str = v.split("");
    var result =""

    str.forEach(element => {
      result+=`&#128${element.charCodeAt()} `
    });

      var found = true
      for(let i=1; i<=cnt; i++){
          if(!userExist(i)){
            document.getElementById('error').style.display = "block";
            document.getElementById('error').innerHTML = "Password already exist please change it...!";
            found = false;
            console.log(i)
            break;
          }
      }

      if(found){
        const obj = {"pass":p,"input":v,"result":result}
        setData(obj,cnt++);
        document.getElementById('error').style.display = "none";
        document.getElementById('result').style.display = "block"
        document.getElementById('result').innerHTML =""+ result

        document.getElementById('txtmsg').value = ""
        document.getElementById('pwd').value = ""
      }

  }

  
}

async function decryption(){
  document.getElementById('error').classList.add("text-[red]")
  document.getElementById('error').style.display = "block"
  var emoji = document.getElementById('emoji').value
  var pwd = document.getElementById('pwd1').value

  
  if(emoji && pwd){
    var result1 = ""

    var str = emoji.split(" ")
    str.forEach(e=>{
      result1+=`&#${e.codePointAt(0)} `
    })
    var found;

    for(let i=1; i<=cnt; i++){
      const d2 = await getData(i);
      // console.log(d2.data())
      try {
        if(d2!=undefined && d2){
            if(d2.data().result === result1 && d2.data().pass ===pwd){
                found = i;
                document.getElementById('result').style.display = "block"
                document.getElementById('result').innerHTML =""+ d2.data().input
                break;
              }
        }
        
      } catch (error) {
        console.log(error)
      }
    }

    if(!found){
      document.getElementById('result').style.display = "block"
      document.getElementById('result').innerHTML ="Result : not found...!"
    }else{
    document.getElementById('emoji').value = ""
    document.getElementById('pwd1').value = ""
    }
  }
  else if(!pwd && !emoji){
    document.getElementById('error').innerHTML = "Please enter encrypted emoji and password";
  }
  else if(emoji){
    document.getElementById('error').innerHTML = "Please enter password";
  }
  else{
    document.getElementById('error').innerHTML = "Please enter encrypted emoji";
  }

}

// document.querySelector('#decryption').style.display = "block"