
    window.load = innit();

    var oPage = {
      recentWords:[],
      fetchedWord:[],
    };;
    function innit(){

      setTimeout(function () {
      //  localStorage.clear();
        if(localStorage.getItem('recent')){
          oPage.recentWords =  JSON.parse(localStorage.getItem('recent'));
          console.log('innit recent::',oPage.recentWords);
        };
        drawMain();
      }, 1);

    }
    var drawMain = (()=>{
      const btnHeader = 'look up word';//example of use of variables in strings
      var sHTML =
          `<div class="header">Dictionary</div>
          <div class="content">
            <div class="headHolder">
              <div class="headHolderInt">
              <input id="tWord" type="search" class="dictIn" placeholder="look up word">
              </div>
              <div class="headHolderInt">
              <button type="button" class="dictBtn">${btnHeader}</button>
              </div>
            </div>
            <div class="wordHolder">
              <div class="word">Look Up a Word</div>
              <div class="definition"></div>
            </div>
            <div class="recentHolder">
              <div class="divrecent">no recent words</div>
            </div>
          </div>`;

          var holdr = document.getElementById('maincard');
          //console.log(holdr,'<<holdr')
          holdr.innerHTML = '';
          var newDiv = document.createElement('div');
          newDiv.innerHTML = sHTML;
          holdr.append(newDiv);
          drawRecent();
          //set up the listeners
          var nwword = document.querySelector('.dictBtn');
          if (!nwword.getAttribute('listener')){
              nwword.addEventListener('click', function(event){
                var newWord = document.getElementById('tWord');
                if (newWord){
                  if (newWord.value===''){
                    ons.notification.alert({message:'Please Enter Something!'});
                    return false;
                  };
                  fetchWord({word:newWord.value});
                };
              //  console.log(newWord,'<<being clicked::',event);
                return;
              },false);
              nwword.setAttribute('listener',true);
          };

        var stWord = document.getElementById('tWord');
        if (!stWord.getAttribute('listener')){
          stWord.addEventListener('keyup', function(event){
            if (event.keyCode === 13) {
            //  console.log(stWord.value,'<<being keyup 13::',event);
              fetchWord({word:stWord.value});
            return;
            };
          },false);
        };
    });

    var fetchWord = ((data)=>{
      //data={word:''}
    //console.log(data,'<<fetchWord::',this);
    //return false;
      if (data.word.length===0){
        alert('Please enter  word!!');
      }else{
      var newData = new Promise((resolve,reject)=>{
       const path = 'https://apiapi.monkeywithoutthee.com/getWordFrom/58/'
            window.fetch(path, {
              method: 'POST',
              headers: {
                'Accept': 'application/json','Content-Type': 'application/json','monkey':'spL1shSplAshSploS4'
              },
              body:JSON.stringify({text:rSC(data.word),fetchType:0})
            })
              .then(response => response.json())
              .then(data => {
                resolve(data);
              })
              .catch(error => {
              //  toastSuccess("There was an error!");
                console.log("error::;", error);
                reject(error);
              })
        })
        newData.then((data)=>{
          //console.log('newData::',data);
          var o = data[0];
          oPage.fetchedWord.unshift(o);
          var el = document.querySelector('.word');
          if(el){el.innerHTML = formatText(o.word)};
          el = document.querySelector('.definition');
          if(el){el.innerHTML = formatText(o.definition)};
          let a = new Array();
          const lsRecent = oPage.recentWords;
          if (lsRecent){a = lsRecent;};
          //console.log(oPage.recentWords,'<<check::',a);
          if (!o.word.includes('is not a word')){//quick fix!
            a.unshift(o.word);
          };
          oPage.recentWords = a;
          localStorage.setItem('recent', JSON.stringify(oPage.recentWords));
        //  console.log(localStorage.getItem('recent'),oPage.fetchedWord,'<<fetch word COMPLETE::', data);
          drawRecent();
        })
      }

    });


    function rSC(data){
    	//the objective it to replace any special characters which might conflict with JS within a string
    	//console.log('rsc receiving::',data);
    		data=data.replaceAll(/\’/g,"")
    			.replaceAll(/\‘/g,"")
    			.replaceAll(/\”/g,"")
    			.replaceAll(/\“/g,"")
    			.replaceAll(/\"/g,"")
    			.replaceAll(/\'/g,"")
    			.replaceAll(/\•/g,"")
    			.replaceAll(/\¥/g,"")
    			.replaceAll(/\€/g,"")
    			.replaceAll(/\£/g,"")
    			.replaceAll(/\`/g,"");

    	 // console.log('rsc returning::',data);
    		return data;
    };
    function formatText(data){
        //console.log('formatText::',data);
        //real basic formating. adds <br> after a period unless there is a number before it!
        var tmpSF = data.split("");
        var tmpST = '';

        if (tmpSF.length > 0){
          for (var i = 0; i < tmpSF.length; i++) {
          //const x = tmpSF[i].toLowerCase().match('.');
          if (tmpSF[i] === '.'){//formating on period
              if (i>0&&i<tmpSF.length-1){
                if (!isNaN(tmpSF[i-1])||tmpSF[i*1+1]!==' '){//number before so skip the break!
                  tmpST += tmpSF[i];
                }else{
                  //just do it
                  tmpST += tmpSF[i]+'<BR>';
                };
              }else{
                //first letter, just do it
                tmpST += tmpSF[i];
              };
          }else{
            //first letter, just do it
            tmpST += tmpSF[i];
          };
        };
      };
        return tmpST;
    };

    var viewRecent = ((event)=>{
      //recalls a definition from  the recent words list
      var o = oPage.recentWords;
      var thisRow = Array.prototype.indexOf.call(event.target.parentElement.parentElement.childNodes, event.target.parentElement);
      //console.log(thisRow,'<<viewRecent::',o[thisRow]);
      if(o[thisRow]){
        fetchWord({word:o[thisRow]});
      };
      return;
    });

    var drawRecent = (()=>{
      //draws the list of recently called words
      //console.log('in draw recent::',oPage.recentWords);
      var sHTML = '';
      var data = oPage.recentWords;
      for (var i = 0; i < data.length; i++) {
        sHTML += `<div class='recentRow'><span class="viewWord">${data[i]}</span><span class="deleteRecent">x</span></div>`;
      };
      var oRecent = document.querySelector('.divrecent');
      var newDiv = document.createElement('div');
      newDiv.innerHTML = sHTML;
      if (oRecent){
        oRecent.innerHTML = '';
        oRecent.append(newDiv);
      };
      return;
    })

    document.addEventListener('click',function(event){
      //global listener??!!! why not?
      if (event.target.className.includes('viewWord')){
        //console.log('in gen click listener::',event.target);
        if(event.target.innerText){
          fetchWord({word:event.target.innerText});
        };
        return;
      };
      if (event.target.className.includes('deleteRecent')){
        var o = oPage.recentWords;
        var thisRow = Array.prototype.indexOf.call(event.target.parentElement.parentElement.childNodes, event.target.parentElement);
        o.splice(thisRow, 1);
        oPage.recentWords = o;
        localStorage.setItem('recent', JSON.stringify(oPage.recentWords));
        //console.log(thisRow,o,'<<deleteRecent::',event.target.parentElement.parentElement.parentElement.childNodes,event.target.parentElement);
        drawRecent();
        return;
      };
    },false);
