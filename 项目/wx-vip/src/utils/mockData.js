const origin = VUE_APP_BASE_API;

/**
 *
 * @param {Object} data
 * @param {string} data.companyKey
 * @param {string} data.openid
 */
export async function setMockCookie(data) {
  const params = new URLSearchParams();
  const { companyKey, openid } = data;
  params.set('companyKey', companyKey);
  params.set('openid', openid);

  try {
    const res = await fetch(`${origin}/jop-web/checkservice?${params.toString()}`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    });

    if (res.ok) {
      const decodeJson = await res.json();
      return decodeJson;
    }

    throw new Error(res.statusText);
  } catch (error) {
    console.warn(error);
  }
}
