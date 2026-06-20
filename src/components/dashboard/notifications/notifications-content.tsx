"use client";

interface SectionHeaderProps {
  title: string;
  description: string;
}

function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-[20px] font-semibold leading-none text-(--color-surface-100)">
        {title}
      </h2>
      <p className="text-base font-normal leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

interface NotificationRowProps {
  children?: React.ReactNode;
}

function NotificationRow({ children }: NotificationRowProps) {
  return (
    <div
      className="flex items-center justify-between rounded-[8px] border border-(--color-border-active) p-3 gap-4"
      style={{ minHeight: 76 }}
    >
      {children}
    </div>
  );
}

interface SectionCardProps {
  children: React.ReactNode;
}

function SectionCard({ children }: SectionCardProps) {
  return (
    <div className="bg-card rounded-[8px] border border-(--color-border-disabled) p-6 flex flex-col gap-8">
      {children}
    </div>
  );
}

export function NotificationContent() {
  return (
    <div className="flex flex-col gap-8 mt-8">
      <div>
        <h1 className="text-2xl font-bold text-(--color-dark-text)">
          Notification Preferences
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose how EnergyIQ keeps you updated about your energy system
        </p>
      </div>

      <SectionCard>
        <SectionHeader
          title="Alert Preference"
          description="Toggle the alerts you want to receive from EnergyIQ"
        />
        <div className="flex flex-col gap-4">
          <NotificationRow>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-(--color-surface-100)">
                Low Battery Alert
              </span>
              <span className="text-sm text-muted-foreground">
                Get notified when battery drops below threshold
              </span>
            </div>
          </NotificationRow>
          <NotificationRow>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-(--color-surface-100)">
                High Load Warning
              </span>
              <span className="text-sm text-muted-foreground">
                Get notified when load consumption is unusually high
              </span>
            </div>
          </NotificationRow>
          <NotificationRow>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-(--color-surface-100)">
                Solar Performance Drop
              </span>
              <span className="text-sm text-muted-foreground">
                Get notified when solar output falls below expected levels
              </span>
            </div>
          </NotificationRow>
          <NotificationRow>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-(--color-surface-100)">
                Grid Power Restored
              </span>
              <span className="text-sm text-muted-foreground">
                Get notified when grid power returns after an outage
              </span>
            </div>
          </NotificationRow>
        </div>
      </SectionCard>

      <SectionCard>
        <SectionHeader
          title="SMS & WhatsApp Delivery Route"
          description="Enter your number to get battery and load alerts on WhatsApp or SMS"
        />
        <div className="flex flex-col gap-6" style={{ minHeight: 142 }}>
          <p className="text-sm text-muted-foreground">
            Content coming soon
          </p>
        </div>
      </SectionCard>

      <SectionCard>
        <SectionHeader
          title="Delivery Channels"
          description="Where should we send your notifications?"
        />
        <div className="flex flex-col gap-6" style={{ minHeight: 79 }}>
          <p className="text-sm text-muted-foreground">
            Content coming soon
          </p>
        </div>
      </SectionCard>

      <SectionCard>
        <SectionHeader
          title="Alert Threshold"
          description="Set when battery alert should trigger"
        />
        <div className="flex flex-col gap-6" style={{ minHeight: 78 }}>
          <p className="text-sm text-muted-foreground">
            Content coming soon
          </p>
        </div>
      </SectionCard>
    </div>
  );
}
