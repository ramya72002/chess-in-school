/* eslint-disable react/no-unescaped-entities */
'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import './RegisteredList.scss';
import * as XLSX from 'xlsx';
import withadminAuth from '@/app/withadminAuth';
import Loading from '@/app/Loading';
import AdminHeader from '../admin_header/adminHeader';

type FilterField = 'sno' | 'profile_id' | 'group' | 'payment_status' | 'financial_assistance' | 'school_name' | 'level';

interface ParentName {
  first: string;
  last: string;
}

interface ChildName {
  first: string;
  last: string;
}

interface FormData {
  profile_id: string;
  parent_name: ParentName;
  child_name: ChildName;
  child_grade: string;
  email: string;
  phone: string;
  RequestFinancialAssistance: boolean;
  SchoolName: string;
  payment_status: string;
  group: string;
  level: string;
}

const Admin: React.FC = () => {
  const [formData, setFormData] = useState<FormData[]>([]);
  const [filteredData, setFilteredData] = useState<FormData[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterVisibility, setFilterVisibility] = useState({
    sno: false,
    profile_id: false,
    group: false,
    payment_status: false,
    financial_assistance: false,
    school_name: false,
    level: false, // Added filter for level
  });
  const [filters, setFilters] = useState({
    sno: '',
    profile_id: '',
    group: '',
    payment_status: '',
    financial_assistance: '',
    school_name: '',
    level: '', // Added filter for level
  });
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    router.push('/adminsignin');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace 'In School Program' with the desired dynamic group value if needed
        const group = 'In School Program'; // This can be set dynamically based on user input or state
        const response = await axios.get<FormData[]>(`https://backend-chess-tau.vercel.app/get_forms_group?group=${encodeURIComponent(group)}`);
        setFormData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter data based on selected filters
    const filtered = formData.filter((item) => {
      return (
        (!filters.sno || item.profile_id.includes(filters.sno)) &&
        (!filters.profile_id || item.profile_id.includes(filters.profile_id)) &&
        (!filters.group || item.group === filters.group) &&
        (!filters.payment_status || item.payment_status === filters.payment_status) &&
        (!filters.financial_assistance ||
          (filters.financial_assistance === 'Yes' && item.RequestFinancialAssistance) ||
          (filters.financial_assistance === 'No' && !item.RequestFinancialAssistance)) &&
        (!filters.school_name || item.SchoolName === filters.school_name) &&
        (!filters.level || item.level === filters.level) // Added filter for level
      );
    });
    setFilteredData(filtered);
  }, [filters, formData]);

  const handleUpdate = (index: number, field: string, value: string) => {
    const originalIndex = formData.findIndex(
      (item) => item.profile_id === filteredData[index].profile_id
    );

    if (originalIndex !== -1) {
      const updatedFormData = [...formData];
      updatedFormData[originalIndex] = {
        ...updatedFormData[originalIndex],
        [field]: value,
      };
      setFormData(updatedFormData);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const selectedData = formData.filter((form) => selectedRows.includes(form.profile_id));
      const updatePayload = {
        updates: selectedData.map((form) => ({
          profile_id: form.profile_id,
          payment_status: form.payment_status,
          group: form.group,
          level: form.level,
        })),
      };
  
      const updateResponse = await axios.post('https://backend-chess-tau.vercel.app/update_forms', updatePayload);
      const updatePayload1 = {
        updates: selectedData.map((form) => ({
          profile_id: form.profile_id,
          payment_status: form.payment_status,
          group: form.group,
          level: form.level,
          email: form.email || '', // Ensure email is present or default to empty string
        })),
      };
      
      if (updateResponse.status === 200) {
        // Call the send_mails_for_updated_records API
        const mailResponse = await axios.post('https://backend-chess-tau.vercel.app/send_mails_for_updated_records', updatePayload1);
        
        if (mailResponse.status === 200) {
          alert('Changes saved and emails sent successfully!');
        } else {
          alert('Changes saved but failed to send emails. Please try again.');
        }
      } else {
        alert('Failed to save changes. Please try again.');
      }
    } catch (error) {
      alert('An error occurred. Please check your selections and try again.');
    } finally {
      setLoading(false);
    }
  };
  

  const handleSelectRow = (profile_id: string) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(profile_id)
        ? prevSelected.filter((id) => id !== profile_id)
        : [...prevSelected, profile_id]
    );
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedRows(filteredData.map((form) => form.profile_id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleExportToExcel = () => {
    const dataToExport = filteredData.map((form) => ({
      profile_id: form.profile_id,
      "Parent's First Name": form.parent_name.first,
      "Parent's Last Name": form.parent_name.last,
      "Child's First Name": form.child_name.first,
      "Child's Last Name": form.child_name.last,
      "Child's Grade": form.child_grade,
      Email: form.email,
      Phone: form.phone,
      'Request Financial Assistance': form.RequestFinancialAssistance ? 'Yes' : 'No',
      'School Name': form.SchoolName,
      'Payment Status': form.payment_status,
      Group: form.group,
      Level: form.level,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Form Submissions');
    XLSX.writeFile(workbook, 'form_submissions.xlsx');
  };

  const toggleFilterVisibility = (field: FilterField) => {
    setFilterVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  return (
    <div><AdminHeader />
    <div className="admin-container">
    
            
            <div className="button-container">
  <h2>School Form Submissions</h2>
  <div className="button-group">
    {/* <button className="logout-button" onClick={handleLogout}>Log Out</button> */}
    <button className="export-button" onClick={handleExportToExcel}>Export to Excel</button>
    <button className="save-button" onClick={handleSubmit}>Save Selected Changes</button>
  </div>
</div>




      {loading && (
        <Loading />
      )}

      {filteredData.length > 0 ? (
        <table className="form-table">
          <thead>
            <tr>
            <th>
                <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
              </th>
            <th>
            <span className="header-text">Sl.</span>
                <button onClick={() => toggleFilterVisibility('sno')}>
                </button>
                {filterVisibility.sno && (
                  <input
                    type="text"
                    placeholder="Filter by S No."
                    value={filters.sno}
                    onChange={(e) => handleFilterChange('sno', e.target.value)}
                  />
                )}
              </th>
              
              <th>
                Id
                <button onClick={() => toggleFilterVisibility('profile_id')}>
                </button>
                {filterVisibility.profile_id && (
                  <input
                    type="text"
                    placeholder="Filter by Profile ID"
                    value={filters.profile_id}
                    onChange={(e) => handleFilterChange('profile_id', e.target.value)}
                  />
                )}
              </th>
              <th>
                Parent's Name
              </th>
              <th>
                Child's Name
              </th>
              <th>
                Grade
              </th>
              <th>
                Email
              </th>
              <th>
                Phone
              </th>
              <th>
              <span className="header-text">Assistance</span>
              <button className='filter-icon' onClick={() => toggleFilterVisibility('financial_assistance')}>
                <i className="fas fa-filter"></i>
              </button>

      {filterVisibility.financial_assistance && (
        <select
          value={filters.financial_assistance}
          onChange={(e) => handleFilterChange('financial_assistance', e.target.value)}
        >
          <option value="">All</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      )}
    </th>
    <th>
  School Name
  <button className='filter-icon' onClick={() => toggleFilterVisibility('school_name')}>
  <i className="fas fa-filter"></i>
</button>

  {filterVisibility.school_name && (
    <select
      value={filters.school_name}
      onChange={(e) => handleFilterChange('school_name', e.target.value)}
    >
      <option value="">All Schools</option>
      <option value="Lombardy Elementary School">Lombardy Elementary School</option>
      <option value="Mount Pleasant Elementary School">Mount Pleasant Elementary School</option>
    </select>
  )}
</th>


              <th>
                Payment Status
                <button className='filter-icon' onClick={() => toggleFilterVisibility('payment_status')}>
  <i className="fas fa-filter"></i>
</button>

                {filterVisibility.payment_status && (
                  <select
                    value={filters.payment_status}
                    onChange={(e) => handleFilterChange('payment_status', e.target.value)}
                  >
                    <option value="">Select Payment Status</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                )}
              </th>

              <th>
                Group
                <button className='filter-icon' onClick={() => toggleFilterVisibility('group')}>
  <i className="fas fa-filter"></i>
</button>

                {filterVisibility.group && (
                  <select
                    value={filters.group}
                    onChange={(e) => handleFilterChange('group', e.target.value)}
                  >
                    <option value="">Select Group</option>
                    <option value="In School Program">In School Program</option>
                    <option value="Club">Club</option>
                  </select>
                )}
              </th>
              <th>
  Level
  <button className='filter-icon' onClick={() => toggleFilterVisibility('level')}>
  <i className="fas fa-filter"></i>
</button>

  {filterVisibility.level && (
    <select
      value={filters.level}
      onChange={(e) => handleFilterChange('level', e.target.value)}
    >
      <option value="">Select Level</option>
      <option value="Level 1">Level 1</option>
      <option value="Level 2">Level 2</option>
      <option value="Level 3">Level 3</option>
      <option value="Level 4">Level 4</option>
      <option value="Level 5">Level 5</option>
      <option value="Level 6">Level 6</option>
    </select>
  )}
</th>

            </tr>
          </thead>
          <tbody>
            {filteredData.map((form, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(form.profile_id)}
                    onChange={() => handleSelectRow(form.profile_id)}
                  />
                </td>
                <td>{index + 1}</td>
                <td>{form.profile_id}</td>
                <td>{form.parent_name.first} {form.parent_name.last}</td>
                <td>{form.child_name.first} {form.child_name.last}</td>
                <td>{form.child_grade}</td>
                <td>{form.email}</td>
                <td>{form.phone}</td>
                <td>{form.RequestFinancialAssistance ? 'Yes' : 'No'}</td>
                <td>{form.SchoolName}</td>
                <td>
                  <div className="radio-buttons">
                    <label>
                      <input
                        type="radio"
                        value="Yes"
                        checked={form.payment_status === 'Yes'}
                        onChange={() => handleUpdate(index, 'payment_status', 'Yes')}
                      /> Yes
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="No"
                        checked={form.payment_status === 'No'}
                        onChange={() => handleUpdate(index, 'payment_status', 'No')}
                      /> No
                    </label>
                  </div>
                </td>
                <td>
                  <select
                    value={form.group}
                    onChange={(e) => handleUpdate(index, 'group', e.target.value)}
                  >
                     <option value="">Select</option>
                    <option value="In School Program">In School Program</option>
                    <option value="Club">Club</option>
                  </select>
                </td>
                <td>
                  <select
                    value={form.level}
                    onChange={(e) => handleUpdate(index, 'level', e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="Level 1">Level 1</option>
                    <option value="Level 2">Level 2</option>
                    <option value="Level 3">Level 3</option>
                    <option value="Level 4">Level 4</option>
                    <option value="Level 5">Level 5</option>
                    <option value="Level 6">Level 6</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No form submissions found.</p>
      )}
    </div>
    </div>
  );
};

export default withadminAuth(Admin);
