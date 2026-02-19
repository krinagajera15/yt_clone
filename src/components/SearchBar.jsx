import { useLocation } from "react-router-dom";

const SearchPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q"); // URL માંથી સર્ચ શબ્દ લેશે
  
  // અહીં તમારે વિડીયો ફિલ્ટર કરવાનું લોજિક લખવાનું:
  // const filtered = allVideos.filter(v => v.title.toLowerCase().includes(query.toLowerCase()));
  
  return (
    <div>
      {filtered.length > 0 ? (
        filtered.map(v => <VideoCard video={v} />)
      ) : (
        <h2>No results found for "{query}"</h2>
      )}
    </div>
  );
};