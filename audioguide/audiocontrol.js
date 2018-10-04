let audioQueue = new Array();
let currentSection = '#lobby';
let readIndex = 0;
let sectionIndex = 0;
let sections = new Array();
let rate = 1;

//Set Sections
console.log($('nav ol').children().each(function(){ sections.push($(this).attr('href'))}));
currentSection = sections[sectionIndex];

console.log(currentSection);
console.log(sections);

//Read the text in large print. Or read transcripts of audio only experiences.
addToReadQueue("Hello and Welcome to the National Comedy Center! This accessibility guide is design to let you experience the story of comedy. You can listen to the various printed texts throughout the museum. ");
addToReadQueue("We also provide audio descriptions to hear about the environment around you.","ad");
addToReadQueue("Swipe up and down on the screen to explore the different exhibits.");
addToReadQueue("To listen to an exhibit double tap the screen.");
addToReadQueue("While the narration is playing you can skip ahead by, swiping right to go forward and left to go back.");
addToReadQueue("Let's Get Laughing! Swipe up to begin.");
readQueue();

function addToReadQueue(text,type){
  audioQueue.push({text:text,type:type});
}

function readQueue(){
  console.log(audioQueue);

    audio = audioQueue[readIndex];
    if(audio.type == 'ad'){
      responsiveVoice.speak(audio.text, "US English Female", {rate: rate, onend:forward});
    }else{
      responsiveVoice.speak(audio.text, "US English Male", {rate: rate, onend:forward});
    }
  /*}else{
    //responsiveVoice.speak("End of Section", "US English Male", {rate: rate} );
  }*/
}

function forward(){
  if(readIndex < audioQueue.length-1){
    readIndex++
    readQueue();
  }
}

function back(){
  if(readIndex > 0){
    readIndex--
    readQueue();
  }
}

function readLi(id){
    clear();
    target = $('a[href="'+id+'"]').children()[0];
    text = target.innerText;
    if(target.className == 'transcript'){
      text += " Transcript"
      responsiveVoice.speak(text,"US English Male", {rate: rate});
    }else if(target.className == 'ad'){
      text += " Audio Description";
      responsiveVoice.speak(text,"US English Female", {rate: rate});
    }else{
      responsiveVoice.speak(text,"US English Male", {rate: rate});
    }
};

function nextSection(){
  if(sectionIndex >= 0 && sectionIndex <= sections.length-2){
    sectionIndex++;
    //Swap what is shown
    $('a[href="'+currentSection+'"]').toggle();
    $('a[href="'+sections[sectionIndex]+'"]').toggle();
    readLi(sections[sectionIndex]);
    //Change currentSection
    currentSection=sections[sectionIndex];
  }else{
    readLi(currentSection);
  }
}

function previousSection(){
  if(sectionIndex > 0 && sectionIndex <= sections.length){
    sectionIndex--;
    //Swap what is shown
    $('a[href="'+currentSection+'"]').toggle();
    $('a[href="'+sections[sectionIndex]+'"]').toggle();
    readLi(sections[sectionIndex]);
    //Change currentSection
    currentSection=sections[sectionIndex];
  }
}

$('#navZone').swipe( {
        //Generic swipe handler for all directions
        swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
          console.log(direction);
          if(direction === 'up'){
            nextSection();
          }else if (direction === 'down'){
            previousSection();
          }else if (direction === 'left'){
            back();
          }else if (direction === 'right'){
            forward();
          }
        },tap: function(){},doubleTap:function(event, target) {
          read(currentSection);
        }
      });

function read(section){
  clear();
  $(section).children().each(function(){addToReadQueue(this.innerText,this.className);});
  readQueue();
}

/*function stop(){
  responsiveVoice.speak('Audio Stopped', 'US English Male', {rate: rate});
  clear();
}*/

function clear(){
  console.log("Queue Cleared")
  responsiveVoice.cancel();
  audioQueue.length = 0;
  readIndex = 0;
}
