import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import "./home.css"

function CardListing() 
{
  const [activeTab, setActiveTab] = useState('Your');
  const [cardData, setCardData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cardTypeFilter, setCardTypeFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterData();
  }, [cardData, searchQuery, cardTypeFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/data?page=${page}&pageSize=${pageSize}`);
      const newData = response.data;
      setCardData((prevData) => [...prevData, ...newData]);
      setPage((prevPage) => prevPage + 1);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const filterData = () => {
    let filteredCards = cardData;

    if (searchQuery) {
      filteredCards = filteredCards.filter((card) =>
        card.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (cardTypeFilter !== 'All') {
      filteredCards = filteredCards.filter((card) => card.type === cardTypeFilter);
    }

    setFilteredData(filteredCards);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCardTypeFilter = (event) => {
    setCardTypeFilter(event.target.value);
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      fetchData();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div className="tabs">
        <button
          className={activeTab === 'Your' ? 'active' : ''}
          onClick={() => handleTabClick('Your')}
        >
          Your
        </button>
        <button
          className={activeTab === 'All' ? 'active' : ''}
          onClick={() => handleTabClick('All')}
        >
          All
        </button>
        <button
          className={activeTab === 'Blocked' ? 'active' : ''}
          onClick={() => handleTabClick('Blocked')}
        >
          Blocked
        </button>
      </div>

      <div className="search">
        <input
          type="text"
          placeholder="Search by card name"
          value={searchQuery}
          onChange={handleSearch}
        />
        <select value={cardTypeFilter} onChange={handleCardTypeFilter}>
          <option value="All">All</option>
          <option value="burner">Burner</option>
          <option value="subscription">Subscription</option>
        </select>
      </div>

      <div className="card-container">
        {filteredData.map((card) => (
          <div className="card" key={card.id}>
            <div className="card-header">
              <span className="card-type">{card.type}</span>
              {card.type === 'burner' && (
                <span className="card-expiry">Expiry: {card.expiry}</span>
              )}
            </div>
            <div className="card-body">
              <h3 className="card-name">{card.name}</h3>
              {card.type === 'subscription' && (
                <p className="card-limit">Limit: {card.limit}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {loading && <p>Loading...</p>}
    </div>
  );
}

export default CardListing;