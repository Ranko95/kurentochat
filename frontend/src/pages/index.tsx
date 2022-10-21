import Conference from 'src/containers/conference';
import { Provider as ConferenceProvider } from 'src/contexts/conference';

const IndexPage = () => {
  return (
    <ConferenceProvider>
      <Conference />
    </ConferenceProvider>
  );
};

export default IndexPage;
