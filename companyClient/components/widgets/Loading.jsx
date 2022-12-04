import Spinner from 'react-native-loading-spinner-overlay';

const Loading = ({ visible, text, textStyle }) => {
    return (
        <Spinner
            visible={visible}
            textContent={text}
            textStyle={textStyle}
        />
    );
};

export default Loading;