import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Topbar from '../../components/layout/Topbar.jsx';
import Icon from '../../components/ui/Icon.jsx';
import PaymentMethodsManager from '../../components/events/PaymentMethodsManager.jsx';
import SelectMenu from '../../components/ui/SelectMenu.jsx';
import DateTimePicker from '../../components/ui/DateTimePicker.jsx';
import { eventsService } from '../../services/events.service.js';
import useToastStore from '../../stores/useToastStore.js';
import { PageSpinner, Spinner } from '../../components/ui/Spinner.jsx';
import { formGrid, formGridSpan2, pageContent, pageHeader, pageSubtitle, pageTitle } from '../../components/layout/layoutClasses.js';
import { btnPrimary, btnSecondary, btnSecondarySm, inputField, inputLabel, inputWrap } from '../../components/ui/componentClasses.js';
import {
  eventFormShell, eventFormBg, eventCreateGrid, eventSection, eventSectionTitle,
  eventCoverBottom, eventActionsBottom, eventDescription, requiredStar,
  locationChoice, locationPill, locationPillDot, locationPillLabel, fieldHint,
  ticketingCheck, ticketingNote, eventBannerPreview, eventBannerImg, eventBannerActions,
  eventFileHidden, eventUploadDrop, eventUploadIcon, eventUploadText, eventUploadTitle,
  eventUploadSub, eventActions, btnWait,
  paymentTypesGroup, paymentTypesLabel, paymentTypeOption, paymentTypeCheckbox,
  paymentTypeTitle, paymentTypeDesc,
} from './eventFormClasses.js';

const MAX_BANNER_MB = 5;

const CATEGORIES = ['Technology', 'Arts & Culture', 'Sports', 'Academic', 'Social', 'Charity', 'Workshop', 'Conference', 'Other'];

function toDatetimeLocal(d) {
  if (!d) return '';
  const dt = new Date(d);
  return new Date(dt.getTime() - dt.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

export default function EditEventPage() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bannerUrl, setBannerUrl] = useState(null);
  const [, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [bannerUploading, setBannerUploading] = useState(false);
  const toast = useToastStore();
  const navigate = useNavigate();

  useEffect(() => {
    eventsService.getEvent(id)
      .then((r) => {
        const ev = r.data;
        setForm({
          title: ev.title || '',
          description: ev.description || '',
          category: ev.category || '',
          location: ev.venue || '',
          start_date: toDatetimeLocal(ev.start_date),
          end_date: toDatetimeLocal(ev.end_date),
          attendee_registration_deadline: toDatetimeLocal(ev.attendee_registration_deadline),
          volunteer_registration_deadline: toDatetimeLocal(ev.volunteer_registration_deadline),
          max_attendees: ev.max_attendees || '',
          max_volunteers: ev.max_volunteers || '',
          is_paid: !!ev.is_paid,
          allow_cash: ev.allow_cash !== false,
          allow_online: ev.allow_online !== false,
        });
        setBannerUrl(ev.banner_url || null);
      })
      .catch(() => { toast.error('Event not found.'); navigate('/events'); })
      .finally(() => setLoading(false));
  }, [id, navigate, toast]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleBannerSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/^image\//.test(file.type)) {
      toast.error('Please select an image file (JPG, PNG, WebP).');
      return;
    }
    if (file.size > MAX_BANNER_MB * 1024 * 1024) {
      toast.error(`Image must be smaller than ${MAX_BANNER_MB}MB.`);
      return;
    }
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));

    // Upload immediately
    setBannerUploading(true);
    try {
      const r = await eventsService.uploadBanner(id, file);
      setBannerUrl(r.data?.bannerUrl || URL.createObjectURL(file));
      toast.success('Banner uploaded.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload banner.');
      setBannerFile(null);
      setBannerPreview(null);
    } finally {
      setBannerUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.start_date || !form.end_date) {
      toast.error('Title, start date, and end date are required.');
      return;
    }
    const start = new Date(form.start_date);
    const end = new Date(form.end_date);
    if (end <= start) {
      toast.error('End date must be after start date.');
      return;
    }
    if (form.attendee_registration_deadline) {
      const ad = new Date(form.attendee_registration_deadline);
      if (ad > start) {
        toast.error('Ticket sales must close on or before the event starts.');
        return;
      }
    }
    if (form.volunteer_registration_deadline) {
      const vd = new Date(form.volunteer_registration_deadline);
      if (vd > end) {
        toast.error('Volunteer application deadline must be on or before the event ends.');
        return;
      }
    }
    if (form.max_attendees !== '' && parseInt(form.max_attendees) < 0) {
      toast.error('Attendee capacity cannot be negative.');
      return;
    }
    if (form.max_volunteers !== '' && parseInt(form.max_volunteers) < 0) {
      toast.error('Volunteer capacity cannot be negative.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description || undefined,
        category: form.category || undefined,
        venue: form.location || undefined,
        startDate: form.start_date,
        endDate: form.end_date || form.start_date,
        isPaid: !!form.is_paid,
        allowCash: form.is_paid ? !!form.allow_cash : true,
        allowOnline: form.is_paid ? !!form.allow_online : true,
        maxAttendees: form.max_attendees === '' ? 0 : parseInt(form.max_attendees),
        maxVolunteers: form.max_volunteers === '' ? 0 : parseInt(form.max_volunteers),
        attendeeRegistrationDeadline: form.attendee_registration_deadline || undefined,
        volunteerRegistrationDeadline: form.volunteer_registration_deadline || undefined,
      };
      await eventsService.updateEvent(id, payload);
      toast.success('Event updated.');
      navigate(`/events/${id}`);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <>
      <Topbar />
      <div className={pageContent}><PageSpinner /></div>
    </>
  );

  if (!form) return null;

  return (
    <>
      <Topbar />
      <div className={pageContent}>
        <div className={eventFormShell}>
          <div className={pageHeader}>
            <div>
              <div className={pageTitle}>Edit Event</div>
              <div className={pageSubtitle}>Update event details</div>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className={eventFormBg}>
              <div className={eventCreateGrid}>
                {/* Left column */}
                <div className="event-create-left">
                  <div className={eventSection}>
                    <div className={eventSectionTitle}>Event Details</div>
                    <div className={formGrid}>
                      <div className={`input-wrap ${formGridSpan2}`}>
                        <label className={inputLabel} htmlFor="title">Title <span className={requiredStar}>*</span></label>
                        <input id="title" name="title" className={inputField} placeholder="Event title" value={form.title} onChange={handleChange} required />
                      </div>
                      <div className={`input-wrap ${formGridSpan2}`}>
                        <label className={inputLabel} htmlFor="category">Category</label>
                        <SelectMenu
                          value={form.category}
                          onChange={(v) => setForm((f) => ({ ...f, category: v }))}
                          placeholder="Select category"
                          width="100%"
                          options={[
                            { value: '', label: 'Select category' },
                            ...CATEGORIES.map((c) => ({ value: c, label: c })),
                          ]}
                          allowClear={false}
                        />
                      </div>
                      <div className={`input-wrap ${formGridSpan2}`}>
                        <label className={inputLabel} htmlFor="description">Description</label>
                        <textarea id="description" name="description" className={`textarea-field ${eventDescription}`} placeholder="Describe your event…" value={form.description} onChange={handleChange} rows={5} />
                      </div>
                    </div>
                  </div>

                  {/* Ticketing */}
                  <div className={eventSection}>
                    <div className={eventSectionTitle}>Ticketing</div>
                    <label className={ticketingCheck}>
                      <input type="checkbox" name="is_paid" checked={form.is_paid} onChange={handleChange} />
                      <span>This is a paid event</span>
                    </label>
                    {form.is_paid && (
                      <>
                        <div className={paymentTypesGroup}>
                          <div className={paymentTypesLabel}>Accepted payment types</div>
                          <label className={paymentTypeOption(form.allow_cash)}>
                            <input type="checkbox" name="allow_cash" checked={form.allow_cash} onChange={handleChange} className={paymentTypeCheckbox} />
                            <div>
                              <div className={paymentTypeTitle}>Cash at venue</div>
                              <div className={paymentTypeDesc}>Attendees reserve now and pay at the event</div>
                            </div>
                          </label>
                          <label className={paymentTypeOption(form.allow_online)}>
                            <input type="checkbox" name="allow_online" checked={form.allow_online} onChange={handleChange} className={paymentTypeCheckbox} />
                            <div>
                              <div className={paymentTypeTitle}>Online transfer</div>
                              <div className={paymentTypeDesc}>bKash, Nagad, Rocket, Bank — add accounts below</div>
                            </div>
                          </label>
                        </div>
                        <div className={ticketingNote}>
                          Set ticket type prices (General, Student, VIP) in the event&apos;s <strong>Manage</strong> page.
                        </div>
                        {form.allow_online && <PaymentMethodsManager eventId={id} />}
                      </>
                    )}
                  </div>
                </div>

                {/* Right column */}
                <div className="event-create-right">
                  <div className={eventSection}>
                    <div className={eventSectionTitle}>Schedule & Capacity</div>
                    <div className={formGrid}>
                      <div className={`input-wrap ${formGridSpan2}`}>
                        <label className={inputLabel}>Location</label>
                        {(() => {
                          const currentMode = form.location_mode || (form.location?.match(/^https?:\/\//) ? 'online' : 'in_person');
                          return (
                            <div className={locationChoice} role="radiogroup" aria-label="Location mode">
                              {[
                                { value: 'in_person', label: 'In person' },
                                { value: 'online', label: 'Zoom / Online' },
                              ].map((opt) => {
                                const active = currentMode === opt.value;
                                return (
                                  <label key={opt.value} className={locationPill(active)}>
                                    <input
                                      type="radio"
                                      name="location_mode"
                                      value={opt.value}
                                      checked={active}
                                      onChange={() => setForm((f) => ({ ...f, location_mode: opt.value, location: '' }))}
                                      className="pointer-events-none absolute opacity-0"
                                    />
                                    <span className={locationPillDot(active)} aria-hidden="true" />
                                    <span className={locationPillLabel}>{opt.label}</span>
                                  </label>
                                );
                              })}
                            </div>
                          );
                        })()}
                        {(form.location_mode || (form.location?.match(/^https?:\/\//) ? 'online' : 'in_person')) === 'online' ? (
                          <input
                            id="location"
                            name="location"
                            type="url"
                            className={inputField}
                            placeholder="https://zoom.us/j/123…  or  https://meet.google.com/…"
                            value={form.location}
                            onChange={handleChange}
                          />
                        ) : (
                          <input
                            id="location"
                            name="location"
                            className={inputField}
                            placeholder="Conference Hall A, Building 3"
                            value={form.location}
                            onChange={handleChange}
                          />
                        )}
                      </div>

                      <div className={inputWrap}>
                        <label className={inputLabel} htmlFor="start_date">Start Date <span className={requiredStar}>*</span></label>
                        <DateTimePicker
                          value={form.start_date}
                          onChange={(v) => setForm((f) => ({ ...f, start_date: v }))}
                        />
                      </div>
                      <div className={inputWrap}>
                        <label className={inputLabel} htmlFor="end_date">End Date <span className={requiredStar}>*</span></label>
                        <DateTimePicker
                          value={form.end_date}
                          onChange={(v) => setForm((f) => ({ ...f, end_date: v }))}
                          min={form.start_date || undefined}
                        />
                      </div>

                      <div className={inputWrap}>
                        <label className={inputLabel} htmlFor="max_attendees">Attendee Capacity</label>
                        <input
                          id="max_attendees"
                          name="max_attendees"
                          type="number"
                          min="0"
                          className={inputField}
                          placeholder="Unlimited"
                          value={form.max_attendees}
                          onChange={handleChange}
                        />
                        <div className={fieldHint}>Total tickets across all types.</div>
                      </div>
                      <div className={inputWrap}>
                        <label className={inputLabel} htmlFor="max_volunteers">Volunteer Capacity</label>
                        <input
                          id="max_volunteers"
                          name="max_volunteers"
                          type="number"
                          min="0"
                          className={inputField}
                          placeholder="Unlimited"
                          value={form.max_volunteers}
                          onChange={handleChange}
                        />
                        <div className={fieldHint}>Total volunteers across all roles.</div>
                      </div>

                      <div className={`input-wrap ${formGridSpan2}`}>
                        <label className={inputLabel} htmlFor="attendee_registration_deadline">Ticket Sales Deadline</label>
                        <DateTimePicker
                          value={form.attendee_registration_deadline}
                          onChange={(v) => setForm((f) => ({ ...f, attendee_registration_deadline: v }))}
                          max={form.start_date || undefined}
                          placeholder="Select deadline…"
                        />
                        <div className={fieldHint}>
                          Last date attendees can buy tickets. Must be on or before the event starts.
                        </div>
                      </div>

                      <div className={`input-wrap ${formGridSpan2}`}>
                        <label className={inputLabel} htmlFor="volunteer_registration_deadline">Volunteer Application Deadline</label>
                        <DateTimePicker
                          value={form.volunteer_registration_deadline}
                          onChange={(v) => setForm((f) => ({ ...f, volunteer_registration_deadline: v }))}
                          max={form.end_date || undefined}
                          placeholder="Select deadline…"
                        />
                        <div className={fieldHint}>
                          Last date volunteers can apply. Can stay open until the event ends.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Banner upload (bottom) */}
              <div className={eventCoverBottom}>
                <div className={eventSectionTitle}>Cover Image</div>
                {(bannerPreview || bannerUrl) ? (
                  <div className={eventBannerPreview}>
                    <img src={bannerPreview || bannerUrl} alt="Banner preview" className={eventBannerImg(bannerUploading)} />
                    {bannerUploading && (
                      <div className={eventBannerActions}>
                        <span className={`btn btn-secondary btn-sm ${btnWait}`}>
                          <Spinner size="sm" /> Uploading…
                        </span>
                      </div>
                    )}
                    {!bannerUploading && (
                      <div className={eventBannerActions}>
                        <label className={btnSecondarySm}>
                          <Icon name="edit" size={14} /> Replace
                          <input type="file" accept="image/*" onChange={handleBannerSelect} className={eventFileHidden} />
                        </label>
                      </div>
                    )}
                  </div>
                ) : (
                  <label className={eventUploadDrop(bannerUploading)}>
                    <div className={eventUploadIcon}>
                      {bannerUploading ? <Spinner size="sm" /> : <Icon name="download" size={22} />}
                    </div>
                    <div className={eventUploadText}>
                      <div className={eventUploadTitle}>{bannerUploading ? 'Uploading…' : 'Click to upload event banner'}</div>
                      <div className={eventUploadSub}>JPG, PNG or WebP · Max {MAX_BANNER_MB}MB · Recommended 1600 × 600</div>
                    </div>
                    <input type="file" accept="image/*" onChange={handleBannerSelect} className={eventFileHidden} disabled={bannerUploading} />
                  </label>
                )}
              </div>

              <div className={`${eventActions} ${eventActionsBottom}`}>
                <button type="button" className={btnSecondary} onClick={() => navigate(`/events/${id}`)}>Cancel</button>
                <button type="submit" className={btnPrimary} disabled={saving}>
                  {saving ? <Spinner size="sm" /> : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
