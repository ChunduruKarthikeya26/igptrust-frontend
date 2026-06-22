export const CodeForm = ({ formData = {} }) => {
    const maskLastName = (name) => {
      if (!name) return '*****';
      if (name.length <= 2) return name;
      return name[0].toLowerCase() + '****' + name[name.length - 1].toLowerCase();
    };
  
    const maskPassword = (password) => {
      if (!password) return '••••••••';
      return '•'.repeat(Math.min(password.length, 12));
    };
  
    const projectDetails = formData.projectDetails || "";
  
    const lines = [
      <><span className="text-blue-500">curl</span> <span className="text-slate-400">-X GET</span> <span className="text-slate-800">'https://api.consentmanager.dev/v1/customers/(customer_id)' \</span></>,
      <><span className="text-slate-400 pl-4">-H</span> <span className="text-slate-800">'Authorization: </span><span className="text-blue-400 text-coral-400">BEARER_TOKEN</span><span className="text-slate-800">'</span></>,
      '',
      <span className="text-slate-800">"fields":&#123;</span>,
      <span className="text-slate-800 pl-4">"name":&#123;</span>,
      <span className="text-slate-800 pl-8">"first_name": <span className="text-blue-500">"{formData.firstName || 'First Name'}"</span>,</span>,
      <span className="text-slate-800 pl-8">"last_name": <span className="text-blue-500">"{maskLastName(formData.lastName)}"</span>,</span>,
      <span className="text-slate-800 pl-4">&#125;,</span>,
      <span className="text-slate-800 pl-4">"work_email": <span className="text-blue-500">"REDACTED"</span>,</span>,
      <span className="text-slate-800 pl-4">"password": <span className="text-blue-500">"{maskPassword(formData.password)}"</span>,</span>,
      <span className="text-slate-800 pl-4">"tell_us_about_your_project": <span className="text-blue-500">"{projectDetails}"</span></span>,
      <span className="text-slate-800">&#125;</span>,
    ];
  
    return (
      <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100 w-full font-mono text-sm overflow-hidden h-fit">
        <div className="flex flex-col w-full">
          {lines.map((line, i) => (
            <div key={i} className="flex items-start leading-7 w-full text-left">
              <div className="text-slate-300 pr-6 select-none w-10 text-right shrink-0">{i + 1}</div>
              <div className="flex-1 min-w-0 text-slate-600 whitespace-pre-wrap break-words text-left">{line}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };