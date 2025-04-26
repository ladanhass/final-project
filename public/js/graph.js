document.addEventListener("DOMContentLoaded", function () {
  //Fetches mood data from server API
  fetch("/journal/api/moods")
    .then((response) => response.json())
    .then((moods) => {
      //Defines days of the week
      const weekDay = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];
      //Maps the mood data to days of the week
      const data = weekDay.map((day) => {
        const moodEntry = moods.find((mood) => mood.day === day);
        return moodEntry ? moodEntry.mood : null; // Return mood value or null if none
      });
      //Gets the canvas context where chart will show
      const ctx = document.getElementById("moodGraph").getContext("2d");
      //Create gradient for graph background
      let gradient = ctx.createLinearGradient(500, 0, 0, 0);
      gradient.addColorStop(0, "rgba(9,9,121)");
      gradient.addColorStop(1, "rgba(8,135,199 ,0.8)");
      //Creates a  new line graph using  fetched data
      new Chart(ctx, {
        type: "line",
        data: {
          labels: weekDay, // X axis labels
          datasets: [
            {
              data: data, // Y axis data
              label: "Mood", // data label
              borderColor: "rgba(35,30,64)",
              backgroundColor: gradient,
              fill: true,
              tension: 0.3, //Smooths the line
              pointRadius: 5,
              pointBackgroundColor: "rgb(120, 124, 245)",
            },
          ],
        },
        options: {
          responsive: true, //Makes chart responsive
          spanGaps: true, // Allows for gaps between points if no data
          animation: {
            duration: 1300,
            easing: "easeInSine", //Animation effect
          },
          //Tooltip for when hovering over points
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  //Maps mood values to emoji for tooltip
                  const moodEmojis = {
                    9: "😆 Joy",
                    8: "😃 Happy",
                    7: "🤩 Excited",
                    6: "😌 Calm",
                    5: "😐 Neutral",
                    4: "😰 Anxious",
                    3: "😱 Fear",
                    2: "😣 Anger",
                    1: "😥 Sadness",
                  };
                  const mood = context.raw; //current mood value
                  return moodEmojis[mood] || ""; //Returns the emoji or empty string
                },
              },
            },
          },

          scales: {
            y: {
              // Y axis settings
              max: 9,
              min: 1,
              ticks: {
                stepSize: 1,
                callback: function (value) {
                  // Replaces numbers with emojis and mood description
                  const moodEmojis = {
                    9: "😆 Joy",
                    8: "😃 Happy",
                    7: "🤩 Excited",
                    6: "😌 Calm",
                    5: "😐 Neutral",
                    4: "😰 Anxious",
                    3: "😱 Fear",
                    2: "😣 Anger",
                    1: "😥 Sadness",
                  };
                  return moodEmojis[value] || value; //Returns emoji and mood
                },
              }, // Y axis title
              title: {
                display: true,
                text: "Mood",
                font: {
                  size: 14,
                  family: "Helvetica",
                  weight: "bold",
                },
                color: "rgb(120, 124, 245)",
              },
            },
            x: {
              // X axis settings
              title: {
                display: true,
                text: "Days of the week", // X axis title
                font: {
                  size: 14,
                  family: "Helvetica",
                  weight: "bold",
                },
                color: "rgb(120, 124, 245)",
              },
            },
          },
        },
      });
    })
    // Handles any error during fetch
    .catch((error) => {
      console.error("error fetching  mood", error);
    });
});
