const testAPI = async () => {
  const res = await fetch('http://localhost:5000/detect-domain', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      skills: [
        { name: "React", level: "beginner" },
        { name: "Golang", level: "advanced" }
      ]
    })
  });
  const data = await res.json();
  console.log('Detect Domain Response:', data);

  const res2 = await fetch('http://localhost:5000/suggest-domain', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      skill: 'golang'
    })
  });
  const data2 = await res2.json();
  console.log('Suggest Domain Response:', data2);
};
testAPI();
