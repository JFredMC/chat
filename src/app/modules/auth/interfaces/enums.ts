export enum ChatType {
    PRIVATE = 'private',
    GROUP = 'group',
}
  
export enum MessageType {
    TEXT = 'text',
    IMAGE = 'image',
    FILE = 'file',
}
  
export enum MessageStatus {
    SENT = 'sent',
    DELIVERED = 'delivered',
    READ = 'read',
}
  
export enum ContactStatus {
    PENDING = 'pending',
    ACCEPT = 'accepted',
    REJECTED = 'rejected',
    BLOCKED = 'blocked',
}
  
export enum UserStatuses {
    ONLINE = 'online',
    OFFLINE = 'offline',
    AWAY = 'away',
    BUSY = 'busy',
}
  