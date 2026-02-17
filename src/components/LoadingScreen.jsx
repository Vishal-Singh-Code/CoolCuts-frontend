import "../styles/LoadingScreen.css";

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loader-wrapper">
        <span className="brand-name">CoolCuts</span>

        <div className="line-loader">
          <span></span>
        </div>

        <p className="loading-text">Getting things ready</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
