
interface LoadingProps {
  isLoading: boolean; // Hoặc isAdminView, hoặc tên khác tùy vào component của bạn
  // ... các props khác
}

const CircularLoadingControl = ({ overlayOpacity = 0.3 }) => {
  return (
    <div style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#000000',
        opacity: overlayOpacity
      }} />
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1
      }}>
        <div style={{
          width: 75,
          height: 75,
          marginBottom: 15,
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            borderWidth: 4,
            borderStyle: 'solid',
            borderColor: 'transparent',
            borderTopColor: 'white',
            borderRightColor: 'white',
            animation: 'spin 2s linear infinite'
          }} />
        </div>
        
        <div style={{
          display: 'flex',
          flexDirection: 'row'
        }}>
          {'Loading'.split('').map((char, index) => (
            <div 
              key={index}
              style={{
                fontSize: 16,
                color: 'white',
                margin: '0 1px',
                animation: 'bounce 0.6s ease infinite alternate',
                animationDelay: `${index * 0.1}s`,
                transform: 'translateY(0)'
              }}
            >
              {char}
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes bounce {
          0% { transform: translateY(0); }
          100% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
};

const Loading: React.FC<LoadingProps> = (isAdminView) => {
  const isLoading = true;
  
  return (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: `${isAdminView.isLoading ? "absolute" : "fixed"}`,
      top: 0,
      backgroundColor: 'black',
      borderRadius: '8px',
      overflow: 'hidden',
      zIndex: 999,
      opacity: 0.4,
    }}>
      {isLoading && <CircularLoadingControl overlayOpacity={0.3} />}
    </div>
  );
};

export default Loading;