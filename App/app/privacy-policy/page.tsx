import React from "react";
import Header from "@/components/ui/Header";

const PrivacyPolicy = () => {
  return (
    <>
      <Header />
      <div className="container mx-auto px-16 py-8 md:px-32 md:py-12">
        <h1 className="text-3xl font-bold mb-4">VoCal Privacy Policy 🔒</h1>
        <h2 className="text-2xl font-bold mb-2">Introduction</h2>
        <p className="mb-4">
          Vocal is a voice-based calendar management app that connects to Google
          Calendar to create events and display schedules based on voice
          commands. By using Vocal, you agree to the collection, storage, and
          usage of personal data as outlined in this policy. This Privacy Policy
          ensures compliance with relevant data protection regulations and
          Google’s requirements for apps that access personal information.
        </p>
        <h2 className="text-2xl font-bold mb-2">Data We Collect</h2>
        <h3 className="text-xl font-bold mb-2">Personal Data</h3>
        <p className="mb-4">
          We collect personal data, such as voice recordings and event details,
          when you interact with Vocal. This includes, but is not limited to:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>
            Your voice commands to create, modify, or view calendar events.
          </li>
          <li>
            Calendar information, such as event titles, dates, times, locations,
            and descriptions, retrieved from your linked Google Calendar.
          </li>
        </ul>
        <h3 className="text-xl font-bold mb-2">Device Information</h3>
        <p className="mb-4">
          We collect non-identifiable device information, such as device type,
          operating system, app version, and unique device identifiers, to
          improve app performance and troubleshoot issues.
        </p>
        <h2 className="text-2xl font-bold mb-2">How We Use Your Data</h2>
        <p className="mb-4">
          Voice Processing: Voice inputs are used to process your requests,
          create events on your Google Calendar, and manage your schedule.
        </p>
        <p className="mb-4">
          Google Calendar Access: We access your Google Calendar to retrieve
          existing events and create new ones based on your commands.
        </p>
        <p className="mb-4">
          Improving Services: Non-identifiable data is used to analyze usage
          patterns and improve our services.
        </p>
        <h2 className="text-2xl font-bold mb-2">Data Sharing and Storage</h2>
        <h3 className="text-xl font-bold mb-2">Third-Party Services</h3>
        <p className="mb-4">
          Vocal uses Google APIs to connect with your Google Calendar. Your data
          is shared with Google to execute voice commands. We do not share your
          personal information with any other third parties.
        </p>
        <h3 className="text-xl font-bold mb-2">Google User Data Privacy</h3>
        <p className="mb-4">
          Our app does not transfer or share any Google User data for
          developing, training, or improving generalized or non-personalized
          AI/ML models. We are committed to protecting your privacy and ensuring
          that your data is used responsibly and securely.
        </p>
        <h3 className="text-xl font-bold mb-2">Data Storage</h3>
        <p className="mb-4">
          Personal data is securely stored on our servers. We ensure encryption
          for data in transit and at rest. Voice inputs may be temporarily
          stored for processing but are not retained after the interaction is
          completed unless required for service improvement or error resolution.
        </p>
        <h2 className="text-2xl font-bold mb-2">User Control Over Data</h2>
        <h3 className="text-xl font-bold mb-2">Data Access</h3>
        <p className="mb-4">
          You have the right to view and manage the data Vocal collects about
          you. This includes your calendar events and voice inputs.
        </p>
        <h3 className="text-xl font-bold mb-2">Data Deletion</h3>
        <p className="mb-4">
          You can request the deletion of your personal data by contacting us at{" "}
          <a href="mailto:support@1851labs.com" className="text-blue-500">
            support@1851labs.com
          </a>
          . Upon request, we will delete your data, unless it is required for
          legal or security purposes.
        </p>
        <h2 className="text-2xl font-bold mb-2">
          Compliance with Google Policies
        </h2>
        <p className="mb-4">
          Vocal complies with Google’s guidelines for accessing Google APIs and
          handles user data with the utmost care to protect privacy. We undergo
          periodic reviews to ensure continued compliance with data protection
          requirements.
        </p>
        <h2 className="text-2xl font-bold mb-2">
          Changes to the Privacy Policy
        </h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. Any changes will
          be reflected on this page, and we encourage you to review it
          regularly. By continuing to use VoCal after changes are made, you
          agree to the updated policy.
        </p>
      </div>
    </>
  );
};

export default PrivacyPolicy;

