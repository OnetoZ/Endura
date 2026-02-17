// Clear intro flags and reload
localStorage.removeItem('endura_intro_completed');
sessionStorage.removeItem('endura_session_visited');
console.log('Intro flags cleared, reloading...');
location.reload();
