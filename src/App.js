import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
const urlParams = new URLSearchParams(window.location.search);
const limit = urlParams.get("limit") || 6;
const App = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const rowCount = data.length;

  useEffect(() => {
    console.log(searchQuery);
    const q = searchQuery.replace(/ /g, '-');
    setIsLoading(true);

    fetch(`https://us-central1-reviewtext-ad5c6.cloudfunctions.net/function-11?limit=${limit}&q=${q}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        try {
          //   const parsedData = JSON.parse(data);
          setData(data);
          setIsLoading(false);
        } catch (error) {
          console.log("Invalid JSON format:", error);
          setIsLoading(false);
        }
      })
      .catch((err) => console.log(err));
  }, [searchQuery]);

  const handleSearchChange = (event) => {

    setSearchQuery(event.target.value);


  };


  return (
    <div>
      <input style={{ width: "60%", boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)" }} type="text" onKeyDown={(event) => event.key === "Enter" && handleSearchChange(event)} placeholder="Search..." />
      <div>
      {isLoading && <p> Loading Data...</p>}
      {/* Rest of your component */}
      </div>
      <h5 style={{ color: "green" }}> Total Rows: {rowCount}</h5>
      {data.map((item) => (
        <div key={item.createdDateTime}>
          <h3 style={{ color: "brown" }}> model: <span style={{ color: "blue", fontSize: "24px" }}>{item.model}</span></h3>
          <div style={{ border: "1px dotted black", padding: "2px" }}>
            <p style={{ color: "grey" }}>{item.question}</p>
          </div>
          <ReactMarkdown>{item.answer}</ReactMarkdown>
        </div>
      ))}
    </div>
  );
};

export default App;
