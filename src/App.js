import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
const App = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [limit, setLimit] = useState('6');
  const [isLoading, setIsLoading] = useState(false);
  const rowCount = data.length;

  useEffect(() => {
    console.log(searchQuery);
    const q = searchQuery.replace(/ /g, '-');
    if (q === '') {
      setSearchQuery('showrecent');
      return;
    }
    setIsLoading(true);
    // set queryParameter string to &q=${q} if q is not empty
    console.log('limit ' + limit);
    const queryParameter = q ? `&q=${q}` : '';
    console.log('queryParametr ' + queryParameter);
    console.log(`https://us-central1-reviewtext-ad5c6.cloudfunctions.net/function-11?limit=${limit}${queryParameter}`);
    fetch(`https://us-central1-reviewtext-ad5c6.cloudfunctions.net/function-11?limit=${limit}${queryParameter}`)
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
  }, [limit, searchQuery]); // <-- Add the limit and searchQuery dependencies

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };



  return (
    <div>
      <input id="searchInput" style={{ fontSizex: "24px", height: "10%", width: "60%", boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)" }} type="text" onKeyDown={(event) => event.key === "Enter" && handleSearchChange(event)} placeholder="Search..." />
      <label htmlFor="limitInput">    Rows Limit:</label>
      <input id="limitInput" style={{ width: "10%", boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)" }} type="text" onKeyDown={(event) => event.key === "Enter" && handleLimitChange(event)} placeholder="6" />
      <div>
        {isLoading && <p> Loading Data...</p>}
        {!isLoading && (
          <>
            {/* Rest of your component */}
            <h5 style={{ width: "30%", color: "green" }}> Fetched Rows: {rowCount}</h5>

            {data.map((item) => (
              <div key={item.createdDateTime}>
                <h4 style={{ color: "brown" }}>
                  Model: <span style={{ color: "blue", fontSize: "22px" }}>{item.model}   </span>
                  Date Time: <span style={{ color: "grey", fontSize: "16px" }}>{item.createdDateTime.toString()}</span>
                </h4>
                <div style={{ border: "1px dotted black", padding: "2px" }}>
                  <div style={{ textAlign: "center", color: "orange", fontWeight: "bold" }}>---Question--</div>
                  <ReactMarkdown>{item.question}</ReactMarkdown>
                </div>
                <br />
                <div style={{ border: "1px solid black", padding: "4px" }}>
                  <div style={{ textAlign: "center", color: "green", fontWeight: "bold" }}>---Answer--</div>
                  <ReactMarkdown>{item.answer}</ReactMarkdown>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
