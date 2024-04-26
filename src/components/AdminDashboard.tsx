import { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const [ownerPercentage, setOwnerPercentage] = useState(100);
  const [collaborators, setCollaborators] = useState([
    {id: 1, name: `Collaborator: ${1}`, percentage: 0, editMode: false },
    {id: 2, name: `Collaborator: ${2}`, percentage: 0, editMode: false },
  ]);

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

  const handlePercentageChange = (index:any, newPercentage:any) => {
    const totalCollaboratorPercentage = collaborators.reduce((acc, curr) => acc + curr.percentage, 0);
    const remainingPercentage = 100 - totalCollaboratorPercentage;

    if (newPercentage <= remainingPercentage) {
      const newCollaborators = [...collaborators];
      newCollaborators[index].percentage = newPercentage;
      setCollaborators(newCollaborators);

      // Update owner's percentage
      setOwnerPercentage(100 - newCollaborators.reduce((acc, curr) => acc + curr.percentage, 0));
      setUnSaved(true);
    } else {
      // Handle error - not enough remaining percentage for allocation
      alert('Not enough remaining percentage for allocation.');
    }
  };

  const handleAddCollaborator = () => {
    const newCollaboratorName = `Collaborator: ${collaborators.length + 1}`;
    setCollaborators([...collaborators, {id: Date.now(), name: newCollaboratorName, percentage: 0, editMode: false }]);
  };

  const removeCollaborator = (id:number) => {
    const collaboratorToRemove = collaborators.find(collaborator => collaborator.id === id);
    // setCollaborators(collaborators.filter(collaborator => collaborator.id !== id));
    if (collaboratorToRemove) {
      // Add the collaborator's percentage to the owner's percentage
      const updatedOwnerPercentage = ownerPercentage + collaboratorToRemove.percentage;
      setOwnerPercentage(updatedOwnerPercentage);
  
      // Remove the collaborator from the collaborators list
      const newCollaborators = collaborators.filter(collaborator => collaborator.id !== id);
      setCollaborators(newCollaborators);
    }
  };

  const toggleEditMode = (index:any) => {
    const newCollaborators = [...collaborators];
    newCollaborators[index].editMode = !newCollaborators[index].editMode;
    setCollaborators(newCollaborators);
  };

  const handleSave = () => {
    alert('Changes saved!');
    setUnSaved(false);
    setIsSaved(true);
  }
  return (
    <div className='bg-yellow-200 min-h-screen min-w-screen flex flex-col items-center justify-center'>
      <h1 className="font-bold text-rose-600 text-4xl underline mb-5">ADMIN DASHBOARD</h1>
      

      <div className="mb-5 w-96">
        <h2 className="text-xl font-semibold mb-2">Owner</h2>
        <p className="text-lg mb-2">Percentage: {ownerPercentage}%</p>
      </div>

      <div className="mb-5 w-96">
        <h2 className="text-xl font-semibold mb-2">Collaborators</h2>
        
        {collaborators.map((collaborator, index) => (
          <div key={index} className="flex items-center space-x-3 mb-3">
            {collaborator.editMode ? (
              <>
                <input
                  className="border-2 ml-3 border-solid border-slate-400 bg-yellow-200 rounded-md py-2 px-3 pr-10 focus:outline-none focus:border-blue-500"
                  type="number"
                  {collaborator.percentage!== 0 ? collaborator.percentage : ''}
                  onChange={(e) => handlePercentageChange(index, parseInt(e.target.value))}
                  disabled={isSaved} 
                />
                <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded focus:outline-none text-lg" onClick={() => toggleEditMode(index)}>Done</button>
              </>
            ) : (
              <>
                <p className="text-lg">{collaborator.name}</p>
                <input
              className="border-2 ml-3 border-solid border-slate-400 bg-yellow-200 rounded-md py-2 px-3 pr-10 focus:outline-none focus:border-blue-500"
              type="number"
              value={collaborator.percentage}
              onChange={(e) => handlePercentageChange(index, parseInt(e.target.value))}
            />
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded focus:outline-none text-lg" onClick={() => toggleEditMode(index)}>Edit</button>
                <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded focus:outline-none text-lg" onClick={() => removeCollaborator(collaborator.id)}>Remove</button>
              </>
            )}
          </div>
        ))}
      </div>
      <div className='flex gap-4'>
        <button className='bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded focus:outline-none text-lg' onClick={handleAddCollaborator}>Add Collaborator</button>
        <button
          className={`bg-${unSaved ? 'red ' : 'blue'}-500 hover:bg-${unSaved ? 'red' : 'blue'}-600 px-3 bg-red-500 hover:bg-red-600 text-white py-2 rounded focus:outline-none text-lg`}
          onClick={handleSave}
        >
          {unSaved ? 'Unsaved' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;

