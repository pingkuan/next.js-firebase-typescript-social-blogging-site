type Props = {
  show: boolean;
};

const Loader: React.FC<Props> = ({ show }) => {
  return show ? <div className='loader'></div> : null;
};

export default Loader;
