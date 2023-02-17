const WORD_LIST = [["engels","english"],["english","engels"],["nederlands","dutch"],["dutch","nederlands"]["jongen","boy"],["meisje","girl"],["kip","chicken"],["chicken","kip"],["een","a"],["a","een"],["ik","i"],["i","ik"],["spreek","speak"],["speak","spreek"],["koe","cow"],["cow","koe"],["vrouw","woman"],["woman","vrouw"],["thee","tea"],["tea","thee"],["de","the"],["het","the"],["en","and"],["and","en"],["man","man"],["kind","child"],["child","kind"],["kinderen","children"],["children","kinderen"],["melk","milk"],["milk","melk"],["sap","juice"],["juice","sap"],["spreekt","speaks"],["speaks","spreekt"],["beetje","bit"],["bit","beetje"],["rijst","rice"],["rice","rijst"],["je","you"],["slecht","bad"],["goed","good"],["good","goed"],["goedemorgen","good morning"],["good morning","goedemorgen"],["goedenavond","good evening"],["good evening","goedenavond"],["boterham","sandwich"],["sandwich","boterham"],["vis","fish"],["fish","vis"]["dog","hond"],["hond","dog"],["kat","cat"],["cat","kat"],["vogel","bird"],["bird","vogel"],["muis","mouse"],["mouse","muis"],["dier","animal"],["animal","dier"],["olifant","elephant"],["elephant","olifant"],["eend","duck"],["duck","eend"],["konijn","rabbit"],["rabbit","konijn"],["paard","horse"],["horse","paard"],["schildpad","turtle"],["turtle","schildpad"],["varken","pig"],["pig","varken"],["hert","deer"],["deer","hert"],["neushoorn","rhinoceros"],["rhinoceros","neushoorn"],["wijn","wine"],["wine","wijn"],["suiker","sugar"],["sugar","suiker"],["nee","no"],["no","nee"],["hij","he"],["he","hij"],["jij","you"],["wij","we"],["we","we"],["links","left"],["rechts","right"],["u","you"],["dank u","thank you"],["niet","not"],["dank je wel","thank you"],["leraar","teacher"],["teacher","leraar"],["blij","happy"],["happy","blij"],["leuk","funny"],["funny","leuk"],["mooi","pretty"],["pretty","mooi"],["oud","old"],["old","oud"],["jong","young"],["young","jong"],["voetballer","footballer"],["footballer","voetballer"],["slager","butcher"],["butcher","slager"],["bakker","baker"],["baker","bakker"],["boer","farmer"],["farmer","boer"],["visser","fisherman"],["fisherman","visser"],["advocaat","lawyer"],["lawyer","advocaat"],["dokter","doctor"],["doctor","dokter"],["ober","waiter"],["waiter","ober"],["kapper","hairdresser"],["hairdresser","kapper"],["verkoper","salesman"],["salesman","verkoper"],["soep","soup"],["soup","soep"],["brood","bread"],["bread","brood"],["dorst","thirst"],["thirst","dorst"],["vlees","meat"],["meat","vlees"],["kaas","cheese"],["cheese","kaas"],["bord","plate"],["plate","bord"],["glas","glass"],["glass","glas"],["pardon","excuse me"],["excuse me","pardon"],["heeft","has"],["has","heeft"],["honger","hunger"],["hunger","honger"],["ontbijt","breakfast"],["breakfast","ontbijt"],["tomaat","tomato"],["tomato","tomaat"],["het spijt me","i'm sorry"],["i'm sorry","het spijt me"],["ik heet","my name is"],["my name is","ik heet"],["maaltijd","meal"],["meal","maaltijd"],["goededag","good day"],["good day","goededag"],["aardbei","strawberry"],["strawberry","aardbei"],["banaan","banana"],["banana","banaan"]];
const DB_WORDS = [];
const game_area = document.getElementById("game");
const text = document.getElementById("text_container");
const ctx = game_area.getContext('2d');
const bg = document.getElementById("bg");
const bg_clouds = document.getElementById("bg_clouds");
const bg_stars = document.getElementById("bg_stars");
const cloud_scroll = document.getElementById("cloud_scroll");
const foreground_width = 1000;
const foreground_height = 400;
let last_update = 0;
let foreground_offset = 0;
let bg_offset = 0;
let game_loop = null;
let start_text_color = "#1d6637";
let font = "40px Arial";
let text_color = "#1d6637";
ctx.font = font;
ctx.textAlign = "center";
//INITIALIZE GAME INSTANCE. CG STANDS FOR current game.
const CG = new Game();
CG.SetGameScreen(ctx);
//CG.SetWordList(WORD_LIST);
window.addEventListener('keydown', function(event) {
  CG.HandleInput(event);
});
window.addEventListener('blur', (event) => {
  if(!CG){return;}
  if(CG.game_state == null) {return;}
  CG.SetState("pause");
});



function UpdateScreen()
{
  let timestamp = Date.now();
  let dt = timestamp - last_update;
  if(dt < 1000/30) {return;}
  ctx.clearRect(0,0,1000,400);
  DrawBackground();
  ScrollClouds(dt);
  CG.Update(dt);
  ControlPauseButton(CG.game_state);
  last_update = timestamp;
    
  
  
}

function DrawBackground()
{
  if(!ctx || !bg) {return;}
  ctx.fillStyle = "#0fdbce";
  ctx.drawImage(bg,0,0,1000,400);
}
function ScrollClouds(d)
{
  if(!bg_clouds && cloud_scroll){return;}
  let delta_time = d/1000;
  //let x_pos_stars =  (foreground_offset * 0.25) % foreground_width;
  let x_pos_bg =  (foreground_offset * 0.125) % foreground_width;
  let x_pos = foreground_offset % foreground_width;
  let x_pos_2 = (foreground_offset * 0.25) % foreground_width;
  //ctx.drawImage(bg_stars,x_pos_stars,0,foreground_width,foreground_height);
  //ctx.drawImage(bg_stars,x_pos_stars+foreground_width,0,foreground_width,foreground_height);
  ctx.drawImage(bg_clouds,x_pos_bg,0,foreground_width,foreground_height);
  ctx.drawImage(bg_clouds,x_pos_bg+foreground_width,0,foreground_width,foreground_height);
  ctx.drawImage(cloud_scroll,x_pos,0,foreground_width,foreground_height);
  ctx.drawImage(cloud_scroll,x_pos + foreground_width,0,foreground_width,foreground_height);
  
  ctx.drawImage(cloud_scroll,x_pos_2,-200,foreground_width,foreground_height);
  ctx.drawImage(cloud_scroll,x_pos_2 + foreground_width,-200,foreground_width,foreground_height);
  foreground_offset -= 30 * delta_time;
}
function Play()
{
  if(CG)
    {
      if(CG.game_state == "play" || CG.game_state == "pause" || CG.game_state == "newgame") {return console.log(CG.game_state);}
      CG.SetState("newgame");
    }
}
function Pause()
{
  if(CG)
    {
      if(!CG.game_state){return;}
      if(CG.game_state == "gameover") {return;}
      if(CG.game_state == "pause")
        {
          CG.SetState("play");
          return;
        }
      CG.SetState("pause");
      
    }
  
}
function StartUpdateLoop()
{
  game_loop = setInterval(function() {UpdateScreen();},30);
}
function FirstStart()
{
  if(!CG){return;}
  fetch('/getgamewords').then((res) => res.json()).then((data) => {

    data.forEach(function(w) {
      if(!DB_WORDS[w.unit])
      {
        DB_WORDS[w.unit] = [w];
      }
      else
      {
        DB_WORDS[w.unit].push(w);
      }
      
    })
  }).then(() => CG.SetWordList(DB_WORDS)).then(() => game_loop = setInterval(function() {UpdateScreen();},30));

  
}
function ControlPauseButton(g_state)
{
  if(!g_state){return;}
  let pause_button = document.getElementById("pause_button");
  switch(g_state)
    {
      case "pause": pause_button.innerHTML = "Unpause";
        break;
      default: pause_button.innerHTML = "Pause";
    }
}
function UpdateGameWords()
{
  if(!CG){return;}
  CG.UpdateWordIndexes();
}
