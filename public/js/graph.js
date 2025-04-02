document.addEventListener("DOMContentLoaded", function (){
//fetches data 
fetch("/journal/api/moods")
.then(reponse => reponse.json())
.then(moods => {
//extracts days and mood values from fetched data
const labels = moods.map(mood => mood.day);
const data = moods.map(mood => mood.mood);
const ctx = document.getElementById("moodGraph").getContext('2d');
//creates a line graph
new Chart(ctx, {
  type:'line',
  data:{
  labels: labels,
  datasets:[{
      data: data,
      label: "Mood",
      borderColor:'rgb(75, 192, 192)',
      fill: false,
      tension: 0.1
  }]
},
  options: {
      responsive:true,
      scales: {
          y:{
              beginAtZero:true,
              min: 1,
              max:5,
              ticks:{
                stepSize: 1,
                callback: function(value){
                  const moodEmojis = {
                    5: '😃 Happy',
                    4: '🤩 Excited',
                    3: '😐 Neutral',
                    2: '😣 Angry',
                    1: '😥 Sad'
                  };
                  return moodEmojis[value] || value;
                }
              },
              title:{
                display:true,
                text:'Mood'
              }

          },
          x:{
            title:{
              display:true,
              text: 'Days of the week'
            }
          }
      }
  }
});
})
//catch(console.error);
});