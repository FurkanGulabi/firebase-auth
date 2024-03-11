const getFormattedDate = () => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    return today.toLocaleDateString('tr-TR', options);
};

const Copyright = () => {
    const currentDate = getFormattedDate();

    return (
        <div
            style={{
                position: 'fixed',
                bottom: 10,
                left: 10,
                color: '#888',
                fontSize: 12,
                fontFamily: 'Arial, sans-serif',
                cursor: 'default',
                userSelect: 'none',
                transition: '.25s'

            }}
            onMouseEnter={(e) => { e.target.style.color = '#acacac' }}
            onMouseLeave={(e) => { e.target.style.color = '#888' }}
        >
            &copy; Furkan Gülabi - {currentDate}
        </div>
    );
};

export default Copyright;
