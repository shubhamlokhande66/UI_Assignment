import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [seenItems, setSeenItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/albums")
      .then((response) => response.json())
      .then((data) => setAlbums(data));
  }, []);

  const generateRandomName = () => {
    const names = ["John", "Jane", "David", "Sarah", "Michael"];
    const randomIndex = Math.floor(Math.random() * names.length);
    return names[randomIndex];
  };

  const handleCardClick = (albumId) => {
    if (searchResults.some((album) => album.id === albumId)) {
      setSearchQuery("");
      setSelectedAlbum(albumId);
      setSeenItems((prevItems) => [...prevItems, ...getAlbumItems(albumId)]);
    } else {
      setSelectedAlbum(albumId);
      setSeenItems((prevItems) => [...prevItems, ...getAlbumItems(albumId)]);
    }
  };

  const handleItemClick = (itemId) => {
    if (!seenItems.includes(itemId)) {
      setSeenItems((prevItems) => [...prevItems, itemId]);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const results = albums.filter((album) =>
      getAlbumItems(album.id).some((item) => item.toLowerCase().includes(query))
    );
    setSearchResults(results);
  };

  const getAlbumItems = (albumId) => {
    const album = albums.find((album) => album.id === albumId);
    return album ? album.title.split(" ") : [];
  };

  const renderAlbumCards = () => {
    return albums.map((album) => {
      const items = getAlbumItems(album.id);
      const itemCount = items.length;
      const seenItemCount = items.filter((item) => seenItems.includes(item))
        .length;
      const unseenItemCount = itemCount - seenItemCount;

      return (

        <div
          key={album.id}
          className={`card ${selectedAlbum === album.id ? "selected" : ""}`}
          onClick={() => handleCardClick(album.id)}
        >
          <span className="card-label">
            {generateRandomName()} - {album.userId}
          </span>
          <span className="item-count">{unseenItemCount}</span>
        </div>
     
      );
    });
  };

  const renderAlbumItems = () => {
    const album = albums.find((album) => album.id === selectedAlbum);
    if (!album) return null;

    const items = getAlbumItems(album.id);
    const seenItemsSet = new Set(seenItems);

    return (
      <div className="album-items">
        {items.map((item, index) => (
          <div
            key={index}
            className={`item ${seenItemsSet.has(item) ? "seen" : ""}`}
            onClick={() => handleItemClick(item)}
          >
            {item}
          </div>
        ))}
      </div>
    );
  };

  const renderSearchResults = () => {
    return searchResults.map((album) => {
      const items = getAlbumItems(album.id);

      return (
        <div key={album.id} className="search-result">
          <div className="search-result-album">
            {generateRandomName()} - {album.userId}
          </div>
          <div className="search-result-items">
            {items.map((item, index) => (
              <div
                key={index}
                className={`item ${seenItems.includes(item) ? "seen" : ""}`}
                onClick={() => handleItemClick(item)}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="app">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <div class="row">
 <div class="col-12">
  <div class="card-deck">
      <div className="album-cards">
        
        {renderAlbumCards()}
        </div>
        </div>
        </div>
        </div>
      {selectedAlbum ? (
        renderAlbumItems()
      ) : (
        <div className="search-results">{renderSearchResults()}</div>
      )}
    </div>
  );
}

export default App;
