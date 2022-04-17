import "./App.css"
import React, { useEffect, useState, useRef } from "react";
import CardContent from "@mui/material/CardContent";
import Typography from "@material-ui/core/Typography";
import Pagination from "@material-ui/lab/Pagination";
import { TextField, Button } from "@material-ui/core";
import StarsIcon from "@mui/icons-material/Stars";
import ForkRightIcon from "@mui/icons-material/ForkRight";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

export default function App() {
  const searchVal = useRef({ value: "" });
  const [gitRepo, setGitRepo] = useState({});
  const per_page = 9;
  const [url, setUrl] = useState(
    "https://api.github.com/search/repositories?q=language:Javascript&page=1&per_page=9"
  );

  useEffect(() => {
    fetch(url, { method: "GET" })
      .then((data) => data.json())
      .then((data) => {
        setGitRepo(data.items);
      });
  }, [url]);

  const handleChange = (e, p) => {
    var temp_url = new URL(url);
    var page = temp_url.searchParams.get("page");
    var query_url = url.replace(page, p);
    setUrl(query_url);
  };

  const handleOrderChange = (e) => {
    var query_url = url.includes("order")
      ? url.includes("order=ASC")
        ? url.replace("order=ASC", "order=" + e.target.value)
        : url.replace("order=DESC", "order=" + e.target.value)
      : url + "&order=" + e.target.value;
    setUrl(query_url);
  };

  const handleSortChange = (e) => {
    var query_url = url.includes("sort")
      ? url.includes("sort=forks")
        ? url.replace("sort=forks", "sort=" + e.target.value)
        : url.replace("sort=stars", "sort=" + e.target.value)
      : url + "&sort=" + e.target.value;
    setUrl(query_url);
  };

  const handleSearch = () => {
    var query_url =
      url.split("?")[0] +
      "?q=" +
      searchVal.current.value +
      "&page=" +
      1 +
      "&per_page=" +
      per_page;
    setUrl(query_url);
  };

  function gitPath(repo) {
    window.open(repo.html_url);
  }

  return (
    <div>
      <h1 className="heading">Github Repos</h1>
          <Select
            labelId="demo-select-small"
            id="demo-select-small"
          className="order_select"
          onChange={handleOrderChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={'ASC'}>ASCENDING</MenuItem>
          <MenuItem value={'DESC'}>DESCENDING</MenuItem>
          </Select>
          <Select
            labelId="demo-select-small"
            id="demo-select-small"
          className="order_select"
          onChange={handleSortChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={'stars'}>STARS</MenuItem>
          <MenuItem value={'forks'}>FORKS</MenuItem>
        </Select>
      <TextField inputRef={searchVal}></TextField>
      <Button variant="outlined" onClick={handleSearch}>
        Search
      </Button>
      <div className="container">
      <div className="row">
      {gitRepo &&
        Object.values(gitRepo).map((repo, key) => {
          return (
              <div
                key={key}
                onClick={() => gitPath(repo)}
                className="github-card"
                
            >
                <CardContent>
                <h1 className="heading">{repo.full_name.split("/")[1]}</h1>
                <h3>{repo.owner.login}</h3>
                <h2>
                  <StarsIcon style={{ color: "#6ec716" }}
                    fontSize="small" />{" "}
                    {repo.stargazers_count}{" "}
                    <ForkRightIcon
                      style={{ color: "#6ec716" }}
                      fontSize="small"
                    />
                    {repo.forks_count}
                  </h2>
                  <Typography className="Typography">
                    {repo.description}
                  </Typography>
                <h4>{repo.language}</h4>
                </CardContent>
            </div>
            
          );
        })}
      
        </div>
        
        </div>

      <Pagination
        style={{ display: "flex", justifyContent: "center" }}
        count={10}
        onChange={handleChange}
      />
    </div>
  );
}
