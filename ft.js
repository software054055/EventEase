// Enhanced ft.js - Making all sections functional

// Show confirmation message
function showConfirmation(msg) {
  const confirmation = document.getElementById("confirmation");
  const message = document.getElementById("confirmationMessage");
  message.textContent = msg;
  confirmation.style.display = "block";
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    confirmation.style.display = "none";
  }, 3000);
}

// ============ CREATE EVENT SECTION ============
// Save Event Function (Enhanced)
window.saveEvent = function () {
  const title = document.getElementById("eventTitle").value.trim();
  const date = document.getElementById("eventDate").value;
  const type = document.getElementById("eventType").value;
  const host = document.getElementById("eventHost").value.trim();

  if (!title || !date || type === "Select Event Type" || !host) {
    showConfirmation("⚠️ Please fill in all fields.");
    return;
  }

  const event = { 
    id: Date.now(), // Unique ID
    title, 
    date, 
    type, 
    host,
    created: new Date().toISOString()
  };
  
  let events = JSON.parse(localStorage.getItem("eventData")) || [];
  events.push(event);
  localStorage.setItem("eventData", JSON.stringify(events));

  showConfirmation("✅ Event saved successfully!");
  document.getElementById("eventList").innerHTML = ""; // Clear old list
  
  // Clear form
  document.getElementById("eventTitle").value = "";
  document.getElementById("eventDate").value = "";
  document.getElementById("eventType").value = "Select Event Type";
  document.getElementById("eventHost").value = "";
};

// View Events Function (Enhanced)
window.fetchEvents = function () {
  const eventList = document.getElementById("eventList");
  const saved = localStorage.getItem("eventData");

  eventList.innerHTML = ""; // Clear previous list

  if (!saved) {
    eventList.innerHTML = "<p>No events saved.</p>";
    showConfirmation("⚠️ No events found.");
    return;
  }

  const events = JSON.parse(saved);
  if (events.length === 0) {
    eventList.innerHTML = "<p>No events saved.</p>";
    showConfirmation("⚠️ No events found.");
    return;
  }

  let html = "<h3>Your Events:</h3>";
  events.forEach((e, i) => {
    html += `
      <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px; background: #f9f9f9;">
        <strong>${i + 1}. ${e.title}</strong><br/>
        <strong>Type:</strong> ${e.type}<br/>
        <strong>Host:</strong> ${e.host}<br/>
        <strong>Date:</strong> ${new Date(e.date).toLocaleDateString()}<br/>
        <small>Created: ${new Date(e.created).toLocaleDateString()}</small>
        <br/><button onclick="deleteEvent(${e.id})" style="background: #ff4444; margin-top: 10px;">Delete</button>
      </div>
    `;
  });
  
  eventList.innerHTML = html;
  showConfirmation("✅ Events loaded successfully!");
};

// Delete Event Function
window.deleteEvent = function(eventId) {
  let events = JSON.parse(localStorage.getItem("eventData")) || [];
  events = events.filter(e => e.id !== eventId);
  localStorage.setItem("eventData", JSON.stringify(events));
  fetchEvents(); // Refresh the list
  showConfirmation("✅ Event deleted!");
};

// ============ CUSTOMIZE SECTION ============
window.saveCustomization = function(event) {
  if (event) event.preventDefault();
  
  const image = document.getElementById("eventImage").files[0];
  const title = document.getElementById("customTitle").value.trim();
  const location = document.getElementById("eventLocation").value.trim();
  const theme = document.getElementById("colorTheme").value;

  if (!title || !location) {
    showConfirmation("⚠️ Please fill in title and location.");
    return;
  }

  const customization = {
    id: Date.now(),
    title,
    location,
    theme,
    hasImage: !!image,
    imageName: image ? image.name : null,
    created: new Date().toISOString()
  };

  let customizations = JSON.parse(localStorage.getItem("customizations")) || [];
  customizations.push(customization);
  localStorage.setItem("customizations", JSON.stringify(customizations));

  showConfirmation(`✅ Event "${title}" customized with ${theme} theme!`);
  
  // Show saved customizations
  displayCustomizations();
  
  // Clear form
  document.getElementById("customTitle").value = "";
  document.getElementById("eventLocation").value = "";
  document.getElementById("eventImage").value = "";
};

window.displayCustomizations = function() {
  const customizations = JSON.parse(localStorage.getItem("customizations")) || [];
  const container = document.getElementById("customizationList") || createCustomizationContainer();
  
  if (customizations.length === 0) {
    container.innerHTML = "<p>No customizations saved yet.</p>";
    return;
  }
  
  let html = "<h3>Your Customizations:</h3>";
  customizations.forEach((c, i) => {
    html += `
      <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px; background: linear-gradient(45deg, ${getThemeColor(c.theme)}, #fff);">
        <strong>${i + 1}. ${c.title}</strong><br/>
        <strong>Location:</strong> ${c.location}<br/>
        <strong>Theme:</strong> ${c.theme}<br/>
        ${c.hasImage ? `<strong>Image:</strong> ${c.imageName}<br/>` : ''}
        <small>Created: ${new Date(c.created).toLocaleDateString()}</small>
      </div>
    `;
  });
  
  container.innerHTML = html;
};

function createCustomizationContainer() {
  const container = document.createElement("div");
  container.id = "customizationList";
  container.style.marginTop = "20px";
  document.getElementById("customize").appendChild(container);
  return container;
}

function getThemeColor(theme) {
  const colors = {
    'Purple': '#e1bee7',
    'Yellow': '#fff9c4',
    'Green': '#c8e6c9',
    'Red': '#ffcdd2',
    'Blue': '#bbdefb'
  };
  return colors[theme] || '#f0f0f0';
}

// ============ CO-ORGANIZER SECTION ============
window.addCoOrganizer = function() {
  const email = document.getElementById("coOrganizerEmail").value.trim();
  const role = document.getElementById("coOrganizerRole").value;
  const notify = document.getElementById("notifyOrganizer").checked;
  const access = document.getElementById("grantAccess").checked;

  if (!email || role === "Assign Role") {
    showConfirmation("⚠️ Please enter email and select role.");
    return;
  }

  if (!email.includes('@')) {
    showConfirmation("⚠️ Please enter a valid email address.");
    return;
  }

  const coOrganizer = {
    id: Date.now(),
    email,
    role,
    notify,
    access,
    status: 'Invited',
    invitedDate: new Date().toISOString()
  };

  let coOrganizers = JSON.parse(localStorage.getItem("coOrganizers")) || [];
  
  // Check if already exists
  if (coOrganizers.some(co => co.email === email)) {
    showConfirmation("⚠️ This email is already added as co-organizer.");
    return;
  }
  
  coOrganizers.push(coOrganizer);
  localStorage.setItem("coOrganizers", JSON.stringify(coOrganizers));

  showConfirmation(`✅ ${email} invited as ${role}!`);
  
  // Clear form
  document.getElementById("coOrganizerEmail").value = "";
  document.getElementById("coOrganizerRole").value = "Assign Role";
  document.getElementById("notifyOrganizer").checked = false;
  document.getElementById("grantAccess").checked = false;
  
  displayCoOrganizers();
};

window.displayCoOrganizers = function() {
  const coOrganizers = JSON.parse(localStorage.getItem("coOrganizers")) || [];
  const container = document.getElementById("coOrganizerList") || createCoOrganizerContainer();
  
  if (coOrganizers.length === 0) {
    container.innerHTML = "<p>No co-organizers added yet.</p>";
    return;
  }
  
  let html = "<h3>Co-Organizers:</h3>";
  coOrganizers.forEach((co, i) => {
    html += `
      <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px; background: #f0f8ff;">
        <strong>${i + 1}. ${co.email}</strong> 
        <span style="background: #6200ea; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">${co.role}</span><br/>
        <strong>Status:</strong> ${co.status}<br/>
        <strong>Notifications:</strong> ${co.notify ? 'Enabled' : 'Disabled'}<br/>
        <strong>Access:</strong> ${co.access ? 'Granted' : 'Pending'}<br/>
        <small>Invited: ${new Date(co.invitedDate).toLocaleDateString()}</small><br/>
        <button onclick="removeCoOrganizer(${co.id})" style="background: #ff4444; margin-top: 10px;">Remove</button>
      </div>
    `;
  });
  
  container.innerHTML = html;
};

window.removeCoOrganizer = function(coId) {
  let coOrganizers = JSON.parse(localStorage.getItem("coOrganizers")) || [];
  coOrganizers = coOrganizers.filter(co => co.id !== coId);
  localStorage.setItem("coOrganizers", JSON.stringify(coOrganizers));
  showConfirmation("✅ Co-organizer removed!");
  displayCoOrganizers();
};

function createCoOrganizerContainer() {
  const container = document.createElement("div");
  container.id = "coOrganizerList";
  container.style.marginTop = "20px";
  document.getElementById("coorganizer").appendChild(container);
  return container;
}

// ============ TEMPLATE SECTION ============
window.selectTemplate = function(templateName) {
  document.getElementById('previewTemplate').textContent = templateName;
  
  const template = {
    id: Date.now(),
    name: templateName,
    selectedDate: new Date().toISOString(),
    status: 'Selected'
  };
  
  localStorage.setItem('selectedTemplate', JSON.stringify(template));
  showConfirmation(`✅ Template "${templateName}" selected!`);
  
  displaySelectedTemplates();
};

window.applyTemplate = function() {
  const selected = localStorage.getItem('selectedTemplate');
  if (!selected) {
    showConfirmation('⚠️ Please select a template first.');
    return;
  }
  
  const template = JSON.parse(selected);
  template.status = 'Applied';
  template.appliedDate = new Date().toISOString();
  
  let appliedTemplates = JSON.parse(localStorage.getItem("appliedTemplates")) || [];
  appliedTemplates.push(template);
  localStorage.setItem("appliedTemplates", JSON.stringify(appliedTemplates));
  
  showConfirmation(`✅ Template "${template.name}" applied to your event!`);
  displaySelectedTemplates();
};

window.saveAsFavorite = function() {
  const selected = localStorage.getItem('selectedTemplate');
  if (!selected) {
    showConfirmation('⚠️ Please select a template first.');
    return;
  }
  
  const template = JSON.parse(selected);
  template.favorite = true;
  template.favoriteDate = new Date().toISOString();
  
  let favorites = JSON.parse(localStorage.getItem("favoriteTemplates")) || [];
  if (!favorites.some(fav => fav.name === template.name)) {
    favorites.push(template);
    localStorage.setItem("favoriteTemplates", JSON.stringify(favorites));
    showConfirmation(`✅ Template "${template.name}" saved as favorite!`);
  } else {
    showConfirmation(`⚠️ Template "${template.name}" is already in favorites.`);
  }
  
  displaySelectedTemplates();
};

window.displaySelectedTemplates = function() {
  const container = document.getElementById("templateHistory") || createTemplateContainer();
  const appliedTemplates = JSON.parse(localStorage.getItem("appliedTemplates")) || [];
  const favorites = JSON.parse(localStorage.getItem("favoriteTemplates")) || [];
  
  let html = "";
  
  if (appliedTemplates.length > 0) {
    html += "<h3>Applied Templates:</h3>";
    appliedTemplates.forEach((template, i) => {
      html += `
        <div style="border: 1px solid #ddd; padding: 10px; margin: 5px 0; border-radius: 5px; background: #e8f5e8;">
          <strong>${template.name}</strong> - Applied on ${new Date(template.appliedDate).toLocaleDateString()}
        </div>
      `;
    });
  }
  
  if (favorites.length > 0) {
    html += "<h3>Favorite Templates:</h3>";
    favorites.forEach((template, i) => {
      html += `
        <div style="border: 1px solid #ddd; padding: 10px; margin: 5px 0; border-radius: 5px; background: #fff3cd;">
          ⭐ <strong>${template.name}</strong> - Favorited on ${new Date(template.favoriteDate).toLocaleDateString()}
        </div>
      `;
    });
  }
  
  if (!html) {
    html = "<p>No templates applied or favorited yet.</p>";
  }
  
  container.innerHTML = html;
};

function createTemplateContainer() {
  const container = document.createElement("div");
  container.id = "templateHistory";
  container.style.marginTop = "20px";
  document.getElementById("template").appendChild(container);
  return container;
}

// ============ CLONE EVENT SECTION ============
window.prefillClone = function(eventName) {
  if (eventName) {
    document.getElementById('cloneTitle').value = `${eventName} - Copy`;
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('cloneDate').value = today;
  }
};

window.cloneEvent = function() {
  const title = document.getElementById('cloneTitle').value.trim();
  const date = document.getElementById('cloneDate').value;
  const tag = document.getElementById('cloneTag').value.trim();
  
  if (!title || !date) {
    showConfirmation('⚠️ Please fill in title and date for cloning.');
    return;
  }
  
  const clonedEvent = {
    id: Date.now(),
    title: title,
    date: date,
    tag: tag || 'No tag',
    type: 'Cloned Event',
    host: 'Current User',
    clonedDate: new Date().toISOString(),
    originalEvent: document.getElementById('cloneSearch').value || 'Unknown'
  };
  
  let clonedEvents = JSON.parse(localStorage.getItem("clonedEvents")) || [];
  clonedEvents.push(clonedEvent);
  localStorage.setItem("clonedEvents", JSON.stringify(clonedEvents));
  
  showConfirmation('✅ Event cloned successfully!');
  
  // Clear form
  document.getElementById('cloneTitle').value = '';
  document.getElementById('cloneDate').value = '';
  document.getElementById('cloneTag').value = '';
  document.getElementById('cloneSearch').value = '';
  
  displayClonedEvents();
};

window.displayClonedEvents = function() {
  const clonedEvents = JSON.parse(localStorage.getItem("clonedEvents")) || [];
  const container = document.getElementById("clonedEventsList") || createClonedEventsContainer();
  
  if (clonedEvents.length === 0) {
    container.innerHTML = "<p>No events cloned yet.</p>";
    return;
  }
  
  let html = "<h3>Cloned Events:</h3>";
  clonedEvents.forEach((event, i) => {
    html += `
      <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px; background: #f0f0ff;">
        <strong>${i + 1}. ${event.title}</strong><br/>
        <strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}<br/>
        <strong>Tag:</strong> ${event.tag}<br/>
        <strong>Cloned from:</strong> ${event.originalEvent}<br/>
        <small>Cloned on: ${new Date(event.clonedDate).toLocaleDateString()}</small>
      </div>
    `;
  });
  
  container.innerHTML = html;
};

function createClonedEventsContainer() {
  const container = document.createElement("div");
  container.id = "clonedEventsList";
  container.style.marginTop = "20px";
  document.getElementById("clone").appendChild(container);
  return container;
}

// ============ VISIBILITY SECTION ============
window.saveVisibilitySettings = function() {
  const visibility = document.getElementById("visibilityStatus").value;
  const joining = document.getElementById("joiningPermission").value;
  const inviteControl = document.getElementById("inviteControl").value;
  const expiration = document.getElementById("accessExpiration").value;
  
  const roles = {
    organizer: document.getElementById("roleOrganizer").checked,
    cohost: document.getElementById("roleCohost").checked,
    viewer: document.getElementById("roleViewer").checked,
    moderator: document.getElementById("roleModerator").checked
  };

  const settings = {
    id: Date.now(),
    visibility,
    joining,
    inviteControl,
    expiration: expiration || 'No expiration',
    roles,
    savedDate: new Date().toISOString()
  };

  localStorage.setItem("visibilitySettings", JSON.stringify(settings));
  showConfirmation("✅ Visibility settings saved!");
  
  displayVisibilitySettings();
};

window.displayVisibilitySettings = function() {
  const settings = JSON.parse(localStorage.getItem("visibilitySettings"));
  const container = document.getElementById("visibilityDisplay") || createVisibilityContainer();
  
  if (!settings) {
    container.innerHTML = "<p>No visibility settings saved yet.</p>";
    return;
  }
  
  const activeRoles = Object.entries(settings.roles)
    .filter(([role, active]) => active)
    .map(([role]) => role.charAt(0).toUpperCase() + role.slice(1))
    .join(', ');
  
  container.innerHTML = `
    <h3>Current Visibility Settings:</h3>
    <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; background: #f8f9fa;">
      <strong>Visibility:</strong> ${settings.visibility}<br/>
      <strong>Joining Permission:</strong> ${settings.joining}<br/>
      <strong>Invite Control:</strong> ${settings.inviteControl}<br/>
      <strong>Access Expiration:</strong> ${settings.expiration}<br/>
      <strong>Active Roles:</strong> ${activeRoles || 'None'}<br/>
      <small>Last updated: ${new Date(settings.savedDate).toLocaleDateString()}</small>
    </div>
  `;
};

function createVisibilityContainer() {
  const container = document.createElement("div");
  container.id = "visibilityDisplay";
  container.style.marginTop = "20px";
  document.getElementById("visibility").appendChild(container);
  return container;
}

// ============ ANALYTICS SECTION ============
window.exportAnalytics = function() {
  const events = JSON.parse(localStorage.getItem("eventData")) || [];
  const coOrganizers = JSON.parse(localStorage.getItem("coOrganizers")) || [];
  const customizations = JSON.parse(localStorage.getItem("customizations")) || [];
  
  const analyticsData = {
    totalEvents: events.length,
    totalCoOrganizers: coOrganizers.length,
    totalCustomizations: customizations.length,
    exportDate: new Date().toISOString(),
    events: events,
    coOrganizers: coOrganizers.map(co => ({ email: co.email, role: co.role, status: co.status }))
  };
  
  const blob = new Blob([JSON.stringify(analyticsData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `event-ease-analytics-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  
  showConfirmation("✅ Analytics exported successfully!");
};

// ============ PROMOTIONS SECTION ============
window.generateHashtags = function() {
  const topic = document.querySelector('#promotions input[placeholder*="Base topic"]').value.trim();
  if (!topic) {
    showConfirmation('⚠️ Please enter a base topic first.');
    return;
  }
  
  const base = topic.toLowerCase().replace(/\s+/g, '');
  const hashtags = [
    `#${base}2025`,
    `#${base}event`,
    `#join${base}`,
    `#${base}live`,
    `#eventease${base}`,
    `#${base}community`,
    `#${base}experience`
  ];
  
  const list = document.getElementById('hashtagList');
  list.innerHTML = hashtags.map(tag => `<li style="margin: 5px 0; padding: 5px; background: #e3f2fd; border-radius: 15px; display: inline-block; margin-right: 10px;">${tag}</li>`).join('');
  
  // Save generated hashtags
  const hashtagData = {
    topic,
    hashtags,
    generatedDate: new Date().toISOString()
  };
  
  let savedHashtags = JSON.parse(localStorage.getItem("generatedHashtags")) || [];
  savedHashtags.push(hashtagData);
  localStorage.setItem("generatedHashtags", JSON.stringify(savedHashtags));
  
  showConfirmation('✅ Hashtags generated and saved!');
};

window.shareToSocial = function(platform) {
  const events = JSON.parse(localStorage.getItem("eventData")) || [];
  if (events.length === 0) {
    showConfirmation('⚠️ Create an event first to share!');
    return;
  }
  
  const latestEvent = events[events.length - 1];
  const shareText = `Join me at ${latestEvent.title} on ${new Date(latestEvent.date).toLocaleDateString()}! 🎉`;
  
  let shareData = {
    platform,
    eventTitle: latestEvent.title,
    sharedDate: new Date().toISOString()
  };
  
  let socialShares = JSON.parse(localStorage.getItem("socialShares")) || [];
  socialShares.push(shareData);
  localStorage.setItem("socialShares", JSON.stringify(socialShares));
  
  showConfirmation(`✅ Event shared to ${platform}! "${shareText}"`);
};

// Show only the selected section
function showSection(id) {
  const sections = document.querySelectorAll(".page-section");
  sections.forEach(sec => {
    sec.style.display = (sec.id === id) ? "block" : "none";
  });
  
  // Load data for specific sections
  setTimeout(() => {
    switch(id) {
      case 'customize':
        displayCustomizations();
        break;
      case 'coorganizer':
        displayCoOrganizers();
        break;
      case 'template':
        displaySelectedTemplates();
        break;
      case 'clone':
        displayClonedEvents();
        break;
      case 'visibility':
        displayVisibilitySettings();
        break;
    }
  }, 100);
}

// Hook up nav links to section switching
document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href").substring(1);
    showSection(targetId);
    window.scrollTo(0, 0);
  });
});

// On page load, show only the first section
window.addEventListener("DOMContentLoaded", () => {
  showSection("create");
});
