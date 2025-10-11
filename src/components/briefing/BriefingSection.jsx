import Briefing from './Briefing';
import Chatbot from '../Chatbot';

export default function BriefingSection() {
  return (
    <div className="flex flex-col justify-start items-start w-full h-full overflow-hidden">
      <div className="w-full flex-shrink-0">
        <Briefing />
      </div>

      <div className="flex-1 w-full overflow-y-auto custom-scroll">
        <Chatbot />
      </div>
    </div>
  );
}
