import React, {useEffect , useState } from 'react'
import { useAuthStore } from '../../store/useAuthStore.js';
import { useAdministrativeStore } from '../../store/useAdministrativeStore.js';

function ConfigRulesPage() {
  const { authUser } = useAuthStore();
  const { userInfoRulesData , isGettingUserInfoRules , getUserInfoRules } = useAdministrativeStore();


  console.log(authUser?.data?.user?._id);
  useEffect(() => {
    const userId = authUser?.data?.user?._id;
    getUserInfoRules({ userId });

  }, [])

  if (isGettingUserInfoRules) {
    return (
      <div>Loading...</div>
    )
  }
  console.log(userInfoRulesData);




  return (
    <>
      <h1>Config Rules</h1>
    </>
  )
}

export default ConfigRulesPage