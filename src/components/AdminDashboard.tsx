import { useEffect, useState } from 'react';

const Form = ({ onSubmit, formName, formPercentage }:any) => {
  const [name, setName] = useState(formName || ''); 
  const [percentage, setPercentage] = useState(formPercentage || ''); 

  const handleSubmit = (event:any) => {
    event.preventDefault();
    onSubmit({ name, percentage: parseInt(percentage) });
    setName('');
    setPercentage('');
  };

  return (
    <div className='flex flex-col mt-[340px] bg-sky-100'>
      <form onSubmit={handleSubmit} className='flex flex-col my-6 justify-center items-center'>
      <label className='flex m-4 text-lg'>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className='ml-11 border-none  bg-slate-300 text-black rounded-md'
        />
      </label>

      <label className='flex m-4 text-lg'>
        Percentage:
        <input
          type="number"
          value={percentage}
          onChange={(e) => setPercentage(e.target.value)}
          required
          className='ml-1 border-black border-none bg-slate-300 text-black rounded-md'
        />
      </label>
      <button className='text-lg bg-slate-400 text-black flex p-2 rounded-lg' type="submit">Add Collaborator</button>
    </form>
    </div>
    
  );
};

const AdminDashboard = () => {
  const [ownerPercentage, setOwnerPercentage] = useState(100);
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [formName, setFormName] = useState('');
  const [formPercentage, setFormPercentage] = useState('');
  const [unSaved, setUnSaved] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
      const handleBeforeUnsaved = (event:any) => {
          if(unSaved) {
              event.preventDefault(),
              event.returnValue = '';
          }
      };
      window.addEventListener('beforeunsaved', handleBeforeUnsaved);
  
      return () => {
        window.removeEventListener('beforeunsaved', handleBeforeUnsaved);
      };
    }, [unSaved]);  

    const handleSave = () => {
          alert('Changes saved!');
          setUnSaved(false);
          setIsSaved(true);
        }

  const handleAddCollaborator = (newCollaborator: any) => {
    if (newCollaborator.percentage < 0) {
      alert('Collaborator percentage cannot be negative.');
      return;
    }
  
    const totalCollaboratorPercentage = collaborators.reduce((acc, curr) => acc + curr.percentage, 0);
  
    const totalPercentageWithNewCollaborator = totalCollaboratorPercentage + newCollaborator.percentage;
  
    if (totalPercentageWithNewCollaborator > 100) {
      alert('Cannot add collaborator. Total percentage exceeds 100%.');
      return;
    }
  
    const newCollaborators = [...collaborators, { ...newCollaborator }];
    setCollaborators(newCollaborators);
  
    const updatedOwnerPercentage = 100 - totalPercentageWithNewCollaborator;
    setOwnerPercentage(updatedOwnerPercentage);
  
    setFormName(newCollaborator.name);
    setFormPercentage(newCollaborator.percentage.toString());
  };
  
  const handleDeleteCollaborator = (index: number) => {
    const deletedCollaborator = collaborators[index];
    const updatedCollaborators = collaborators.filter((_, i) => i !== index);
    const totalCollaboratorPercentage = updatedCollaborators.reduce((acc, curr) => acc + curr.percentage, 0);
    const updatedOwnerPercentage = 100 - totalCollaboratorPercentage;

    setCollaborators(updatedCollaborators);
    setOwnerPercentage(updatedOwnerPercentage);

    if (deletedCollaborator.name === formName) {
      setFormName('');
      setFormPercentage('');
    }
  };


  return (
    <div>
      <h1 className='flex flex-col items-center justify-center text-4xl border-b p-4 bg-slate-950 text-white'>Admin DashBoard</h1>
    <div className='flex my-10 border-b items-center justify-between mx-32'>
      <h2 className='text-2xl mb-2'>Thaw Zin Htut <span className="flex-1 m-1 absolute rounded bg-blue-600 text-sm font-thin text-white">Owner</span></h2>
      <p className='text-2xl mb-2'>Percentage: <span>{ownerPercentage}%</span></p>
    </div>

    <div>
      {collaborators.map((collaborator, index) => (
        <div key={index} className='flex my-4 border-b items-center justify-between mx-32'>
          <h3 className='text-2xl mb-2'>{collaborator.name} <span className='flex-1 m-1 absolute rounded bg-red-600 text-sm font-thin text-white'>New</span></h3>
          

          <div>
            <p className='text-2xl mb-2'>Percentage: <span>{collaborator.percentage}%</span></p>
            <button className='bg-red-400 rounded ml-32 text-white p-1' onClick={() => handleDeleteCollaborator(index)}>Delete</button>   
          </div>
          
        </div>
        
      ))}

       
    </div> 
    
      <div className='flex justify-end mr-28'>
        <button
          className={`bg-${unSaved ? 'red ' : 'blue'}-500 hover:bg-${unSaved ? 'red' : 'blue'}-600 px-3 bg-blue-400 hover:bg-blue-500 text-white py-2 rounded focus:outline-none text-lg`}
          onClick={handleSave}
        >
          {unSaved ? 'Unsaved' : 'Save'}
        </button>
      </div>
    {/* Form for adding new collaborator */}
    <Form
      onSubmit={handleAddCollaborator}
      formName={formName}
      formPercentage={formPercentage}
      disabled={isSaved}
    />
  </div>
  )
}

export default AdminDashboard;
