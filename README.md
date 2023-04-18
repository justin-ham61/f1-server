# f1-server

/* tab bar */
@media screen and (max-width: 1000px) {
    .large-tabs{
      display: none;
    }
    .header-box {
      display: none;
    }
    .small-tabs-bar{
      display: flex;
    }
}

@media screen and (min-width: 1000px) {
  .large-tabs{
    display: flex;
  }
  .header-box{
    display: flex;
  }
  .small-tabs-bar{
    display: none;
  }
}

.tabs-bar {
  width: 100%;
  height: 75px;
  background-color: rgb(255, 17, 0);
  display: flex;
  align-items: center;
}

.small-tabs-bar{
  justify-content: space-between;
  width: 90%;
}

.small-tabs-button{
  margin-left: 30px;
  color: white;
  transition: .4s ease-in;
  transition: .3s;
}

.small-tabs-button:hover{
  color: black;
  cursor: pointer;
}