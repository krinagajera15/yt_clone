// import React from "react";
// import "./Shorts.css";

// const shortsData = [
//   {
//     id: 1,
//     video: "https://www.w3schools.com/html/mov_bbb.mp4",
//     title: "React Tips 🔥",
//   },
//   {
//     id: 2,
//     video: "https://www.w3schools.com/html/movie.mp4",
//     title: "JavaScript Shorts ⚡",
//   },
// //   {
// //     id:3,
// //     video: "https://youtube.com/shorts/UBDocfEiFlA?si=rMUqVzG-lwcLEAiY",
// //     title: "buty"
// //   }
// ];

// const Shorts = () => {
//   return (
//     <div className="shorts-container">
//       {shortsData.map((short) => (
//         <div className="short-card" key={short.id}>
//           <video
//             src={short.video}
//             autoPlay
//             loop
//             muted
//             controls={false}
//           />
//           <h4>{short.title}</h4>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Shorts;
// import React from "react";
// import "./Shorts.css";

// const shortsData = [
//   {
//     id: 1,
//     video: "https://www.w3schools.com/html/mov_bbb.mp4",
//     title: "React Tips 🔥",
//     likes: 928,
//     comments: 12,
//   },
//   {
//     id: 2,
//     video: "https://www.w3schools.com/html/movie.mp4",
//     title: "JavaScript Shorts ⚡",
//     likes: 1200,
//     comments: 48,
//   },
//   {
//     id:3,
//     video: "https://youtube.com/shorts/UBDocfEiFlA?si=rMUqVzG-lwcLEAiY",
//     title: "buty"
//   }
// ];

// const Shorts = () => {
//   return (
//     <div className="shorts-container">
//       {shortsData.map((short) => (
//         <div className="short-card" key={short.id}>
          
//           {/* VIDEO */}
//           <video
//             src={short.video}
//             autoPlay
//             loop
//             muted
//           />

//           {/* TITLE */}
//           <h4>{short.title}</h4>

//           {/* ACTION ICONS */}
//           <div className="short-actions">
//             <div>👍 <span>{short.likes}</span></div>
//             <div>👎 <span>Dislike</span></div>
//             <div>💬 <span>{short.comments}</span></div>
//             <div>🔗 <span>Share</span></div>
//             <div>🔁 <span>Remix</span></div>
//           </div>

//         </div>
//       ))}
//     </div>
//   );
// };

// export default Shorts;
import React from "react";
import "./Shorts.css";

const shortsData = [
  {
    id: 1,
    videoId: "UBDocfEiFlA",
    title: "React Tips 🔥",
    likes: 928,
    comments: 12,
  },
  {
    id: 4,
    videoId: "oy8lS29ckr4",
    title:"prret re",
    likes:900,
    comments:56
  },
  {
    id: 3,
    videoId: "dQw4w9WgXcQ",
    title: "JavaScript Shorts ⚡",
    likes: 1200,
    comments: 48,
  },
];

const Shorts = () => {
  return (
    <div className="shorts-container">
      {shortsData.map((short) => (
        <div className="short-card" key={short.id}>
          
          {/* VIDEO */}
          <iframe
            className="short-video"
            src={`https://www.youtube.com/embed/${short.videoId}?autoplay=1&mute=1&loop=1&playlist=${short.videoId}`}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>

          {/* TITLE */}
          <h4 className="short-title">{short.title}</h4>

          {/* ACTIONS */}
          <div className="short-actions">
            <div className="action">👍 <span>{short.likes}</span></div>
            <div className="action">👎 <span>Dislike</span></div>
            <div className="action">💬 <span>{short.comments}</span></div>
            <div className="action">🔗 <span>Share</span></div>
            <div className="action">🔁 <span>Remix</span></div>
          </div>

        </div>
      ))}
    </div>
  );
};

export default Shorts;
