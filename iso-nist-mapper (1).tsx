import React, { useState, useEffect } from 'react';

// Descriptions for ISO controls
const isoDescriptions = {
  "8.1": "User end point devices - Implement security to protect information accessed, processed or stored at user end point devices.",
  "8.2": "Privileged access rights - Restrict and control allocation and use of privileged access rights.",
  "8.3": "Information access restriction - Implement procedures for restricting access to information.",
  "8.4": "Access to source code - Restrict access to program source code.",
  "8.28": "Secure coding - Establish and apply secure coding guidelines and standards to minimize vulnerabilities in application code, with regular code reviews and security testing.",
  "5.14": "Information transfer - Secure information transfer within the organization and with any external entity."
};

// Descriptions for NIST controls
const nistDescriptions = {
  "AC-11": "Device Lock - Prevent access to devices after a period of inactivity by initiating a device lock.",
  "AC-6": "Least Privilege - Employ principle of least privilege, allowing only authorized accesses.",
  "AC-3": "Access Enforcement - Enforce approved authorizations for logical access to system resources.",
  "IR-4": "Incident Handling - Implement an incident handling capability including preparation, detection, analysis, containment, eradication, and recovery.",
  "SC-13": "Cryptographic Protection - Implement cryptographic mechanisms to achieve confidentiality, integrity, and non-repudiation."
};

const IsoNistMapper = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mappingData, setMappingData] = useState({
    isoToNist: {},
    nistToIso: {}
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('iso'); // 'iso' or 'nist'
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const parseData = async () => {
      try {
        setIsLoading(true);
        
        // Sample mapping data (you would normally parse this from your file)
        const isoToNist = {
          "8.1 User end point devices": "AC-11",
          "8.2 Privileged access rights": "AC-6, AC-3",
          "8.3 Information access restriction": "AC-3",
          "8.4 Access to source code": "AC-3",
          "8.28 Secure coding": "SA-8, SA-11",
          "5.14 Information transfer": "AC-4, AC-17, AC-18, AC-19, AC-20, CA-3, SC-8"
        };
        
        const nistToIso = {
          "AC-11 Device Lock": "A.7.7, A.8.1",
          "AC-6 Least Privilege": "A.5.15, A.8.2, A.8.18",
          "AC-3 Access Enforcement": "A.5.15, A.5.33, A.8.3, A.8.4, A.8.18, A.8.20, A.8.26",
          "IR-4 Incident Handling": "A.5.25, A.5.26, A.5.27",
          "SC-13 Cryptographic Protection": "A.8.24, A.8.26, A.5.31"
        };
        
        setMappingData({
          isoToNist,
          nistToIso
        });
        
        setIsLoading(false);
      } catch (err) {
        setError('Error loading or parsing mapping data: ' + err.message);
        setIsLoading(false);
      }
    };
    
    parseData();
  }, []);

  // Handle search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    const query = searchQuery.trim().toLowerCase();
    
    if (searchType === 'iso') {
      // Search ISO controls
      const results = Object.keys(mappingData.isoToNist)
        .filter(control => control.toLowerCase().includes(query))
        .map(control => ({
          control,
          mapping: mappingData.isoToNist[control],
          description: getIsoDescription(control)
        }));
      
      setSearchResults(results);
    } else {
      // Search NIST controls
      const results = Object.keys(mappingData.nistToIso)
        .filter(control => control.toLowerCase().includes(query))
        .map(control => ({
          control,
          mapping: mappingData.nistToIso[control],
          description: getNistDescription(control)
        }));
      
      setSearchResults(results);
    }
  }, [searchQuery, searchType, mappingData]);

  // Get ISO control description
  const getIsoDescription = (control) => {
    // Extract the control number (e.g., "8.1" from "8.1 User end point devices")
    const match = control.match(/^(\d+\.\d+)/);
    if (match) {
      const controlNum = match[1];
      return isoDescriptions[controlNum] || "No detailed description available";
    }
    return "No detailed description available";
  };

  // Get NIST control description
  const getNistDescription = (control) => {
    // Extract the control number (e.g., "AC-11" from "AC-11 Device Lock")
    const match = control.match(/^([A-Z]+-\d+)/);
    if (match) {
      const controlNum = match[1];
      return nistDescriptions[controlNum] || "No detailed description available";
    }
    return "No detailed description available";
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">ISO 27001 to NIST 800-53 Control Mapper</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="text-center p-8">
          <div className="text-gray-600">Loading control mappings...</div>
        </div>
      ) : (
        <div>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <label className="mr-4 font-medium">Search for:</label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio"
                      checked={searchType === 'iso'}
                      onChange={() => setSearchType('iso')}
                    />
                    <span className="ml-2">ISO 27001 Control</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio"
                      checked={searchType === 'nist'}
                      onChange={() => setSearchType('nist')}
                    />
                    <span className="ml-2">NIST 800-53 Control</span>
                  </label>
                </div>
              </div>
              
              <div className="mt-2">
                <input
                  type="text"
                  placeholder={`Enter ${searchType === 'iso' ? 'ISO 27001' : 'NIST 800-53'} control (e.g., ${searchType === 'iso' ? '8.1' : 'AC-11'})`}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4">Search Results ({searchResults.length})</h2>
            
            {searchResults.length === 0 ? (
              searchQuery ? (
                <p>No controls found matching your search. Try a different search term.</p>
              ) : (
                <p>Enter a search term to find controls.</p>
              )
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {searchType === 'iso' ? 'ISO 27001 Control' : 'NIST 800-53 Control'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Maps to {searchType === 'iso' ? 'NIST 800-53' : 'ISO 27001'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {searchResults.map((result, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">
                            {result.control}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700">
                            {result.description}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700">
                            {result.mapping}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          <div className="mt-6 bg-gray-100 p-4 rounded-md">
            <h3 className="font-medium mb-2">Quick Reference</h3>
            <p className="text-sm text-gray-700 mb-2">
              <strong>ISO 27001 Example Controls:</strong> 8.1, 5.14, 7.9
            </p>
            <p className="text-sm text-gray-700">
              <strong>NIST 800-53 Example Controls:</strong> AC-11, IR-4, SC-13
            </p>
          </div>
          
          <div className="mt-6 bg-white rounded-lg shadow-md p-4">
            <h3 className="text-xl font-semibold mb-4">NIST SP 800-53 Control Families</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <h4 className="font-medium text-red-800">AC - Access Control</h4>
                  <p className="text-sm text-gray-700">Controls for system access, privileges, access enforcement, and device authentication.</p>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium text-red-800">AU - Audit and Accountability</h4>
                  <p className="text-sm text-gray-700">Controls for creating, protecting, and retaining system audit logs.</p>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium text-red-800">IR - Incident Response</h4>
                  <p className="text-sm text-gray-700">Controls for establishing incident handling capabilities including preparation, detection, analysis, containment, and recovery.</p>
                </div>
              </div>
              
              <div>
                <div className="mb-4">
                  <h4 className="font-medium text-red-800">SC - System and Communications Protection</h4>
                  <p className="text-sm text-gray-700">Controls for protecting communications and data transmission between systems.</p>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium text-red-800">SA - System and Services Acquisition</h4>
                  <p className="text-sm text-gray-700">Controls for system development, acquisition, and security engineering principles.</p>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium text-red-800">SI - System and Information Integrity</h4>
                  <p className="text-sm text-gray-700">Controls for identifying, reporting, and correcting information and system flaws.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IsoNistMapper;
