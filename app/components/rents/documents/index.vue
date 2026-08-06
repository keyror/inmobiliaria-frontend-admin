<template>
  <div>
    <div class="card-header ps-0 d-flex justify-content-between align-items-center">
      <h5>Documentos del Contrato</h5>
      <button
        v-if="props.rentId && can('documents.create')"
        type="button"
        class="btn btn-pill btn-gradient color-4"
        @click="showAddModal = true"
      >
        <i class="bi bi-plus-circle me-1"></i> Agregar Documento
      </button>
    </div>

    <div v-if="!props.rentId" class="alert alert-info">
      Guarde el contrato primero para poder gestionar documentos.
    </div>

    <div v-else>
      <div v-if="documents.length === 0" class="alert alert-secondary">
        Este contrato no tiene documentos aún.
      </div>

      <div class="table-responsive" v-else>
        <table class="table table-bordered table-hover rents-docs-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Categoría</th>
              <th>N°</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="doc in documents" :key="doc.id">
              <td>{{ doc.title }}</td>
              <td>{{ doc.document_category?.name ?? "-" }}</td>
              <td>{{ doc.number ?? "-" }}</td>
              <td>
                <span class="badge bg-secondary">{{ doc.status?.name ?? doc.status_id ?? "-" }}</span>
              </td>
              <td>{{ doc.document_date ?? "-" }}</td>
              <td>
                <CommonActionsDropdown :actions="docActions(doc)" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de firmantes -->
    <CommonModal
      v-model:show="showSignatoryModal"
      title="Firma electrónica"
      size="lg"
      @close="closeSignatoryModal"
    >
      <div v-if="signatoryDoc" class="signatory-modal-content">
        <!-- Estado del documento -->
        <div class="d-flex align-items-center gap-2 mb-3">
          <span class="text-muted small">Documento:</span>
          <strong class="small">{{ signatoryDoc.title }}</strong>
          <span
            class="badge ms-1"
            :class="signatoryStatusBadge(signatoryDoc.status?.alias)"
          >{{ signatoryDoc.status?.name ?? signatoryDoc.status_id }}</span>
        </div>

        <div v-if="signatoryDoc.status?.alias === 'firmado'" class="alert alert-success py-2 small w-100 mb-2">
          <i class="fas fa-check-circle me-1"></i> Documento firmado. Descarga el PDF para ver las firmas incrustadas.
        </div>
        <div v-if="signatoryDoc.status?.alias === 'firmado'" class="d-flex gap-2 flex-wrap mb-3">
          <button class="btn btn-dashed color-4 btn-sm" :disabled="downloadingCert" @click="downloadCertificate(signatoryDoc)">
            <i v-if="downloadingCert" class="fas fa-spinner fa-spin me-1"></i>
            <i v-else class="fas fa-certificate me-1"></i>
            Certificado de evidencias
          </button>
          <button
            v-if="signatoryDoc.has_tsr"
            class="btn btn-dashed color-3 btn-sm"
            :disabled="downloadingTsr"
            @click="downloadTsrFile(signatoryDoc)"
          >
            <i v-if="downloadingTsr" class="fas fa-spinner fa-spin me-1"></i>
            <i v-else class="fas fa-stamp me-1"></i>
            Sello TSR (.tsr)
          </button>
          <button
            v-if="signatoryDoc.has_tsr"
            class="btn btn-dashed color-3 btn-sm"
            :disabled="downloadingTsq"
            @click="downloadTsqFile(signatoryDoc)"
          >
            <i v-if="downloadingTsq" class="fas fa-spinner fa-spin me-1"></i>
            <i v-else class="fas fa-file-alt me-1"></i>
            Petición TSQ (.tsq)
          </button>
        </div>

        <div v-else-if="signatoryDoc.status?.alias === 'enviado'" class="alert alert-info py-2 small">
          <i class="fas fa-paper-plane me-1"></i> Enviado a firmar. Los firmantes recibieron un correo con el enlace.
        </div>

        <div v-else-if="signatoryDoc.status?.alias !== 'generado'" class="alert alert-warning py-2 small">
          <i class="fas fa-exclamation-triangle me-1"></i>
          Solo se puede enviar a firmar cuando el documento está en estado <strong>Generado</strong>.
        </div>

        <!-- Tabla de firmantes actuales -->
        <div v-if="loadingSignatories" class="text-center py-3">
          <i class="fas fa-spinner fa-spin me-1"></i> Cargando firmantes...
        </div>
        <template v-else>
          <div v-if="signatories.length === 0 && signatoryDoc.status?.alias !== 'generado'" class="text-muted small">
            Sin firmantes registrados.
          </div>

          <!-- Lista de firmantes guardados (solo lectura si ya fue enviado) -->
          <div v-if="signatories.length > 0 && signatoryDoc.status?.alias !== 'generado'" class="mb-3">
            <table class="table table-sm table-bordered signatories-table">
              <thead>
                <tr>
                  <th style="width:30px">#</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th v-if="signatoryDoc.status?.alias === 'enviado' || signatoryDoc.status?.alias === 'firmado'"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="s in signatories" :key="s.id ?? s.order">
                  <td>{{ s.order }}</td>
                  <td>{{ s.name }}</td>
                  <td>{{ s.email }}</td>
                  <td>{{ ROLE_LABELS[s.role] ?? s.role }}</td>
                  <td>
                    <span class="badge" :class="signatoryStatusBadge(s.status)">
                      {{ STATUS_LABELS[s.status] ?? s.status }}
                    </span>
                    <div v-if="s.rejection_reason" class="text-danger small mt-1">
                      {{ s.rejection_reason }}
                    </div>
                  </td>
                  <td v-if="signatoryDoc.status?.alias === 'enviado' || signatoryDoc.status?.alias === 'firmado'">
                    <button
                      v-if="signatoryDoc.status?.alias === 'enviado' && (s.status === 'pending' || s.status === 'viewed')"
                      class="btn btn-dashed color-2 btn-sm"
                      title="Reenviar correo de invitación"
                      :disabled="resendingId === s.id"
                      @click="resendSignatory(s)"
                    >
                      <i v-if="resendingId === s.id" class="fas fa-spinner fa-spin"></i>
                      <i v-else class="fas fa-redo"></i>
                    </button>
                    <button
                      v-if="signatoryDoc.status?.alias === 'firmado' && s.status === 'signed'"
                      class="btn btn-dashed color-2 btn-sm"
                      title="Reenviar correo firmado"
                      :disabled="resendingCompletionId === s.id"
                      @click="openResendSignatoryModal(s)"
                    >
                      <i v-if="resendingCompletionId === s.id" class="fas fa-spinner fa-spin"></i>
                      <i v-else class="fas fa-envelope"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Editor / vista de firmantes (editable en generado, solo lectura en firmado) -->
          <template v-if="['generado', 'firmado'].includes(signatoryDoc.status?.alias ?? '')">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="fw-bold small">Firmantes</span>
              <span v-if="proposedSignatories" class="badge bg-light text-dark small">
                Pre-cargados desde la plantilla
              </span>
            </div>

            <form class="admin-form">
              <div
                v-for="(s, idx) in signatoryRows"
                :key="idx"
                class="row gx-2 mb-2 align-items-center signatory-row"
              >
                <div class="col-auto" style="width:36px">
                  <span class="badge bg-secondary text-white">{{ idx + 1 }}</span>
                </div>
                <CommonInputfieldsTextfield
                  classes="col"
                  label="Nombre completo"
                  placeholder="Nombre completo"
                  :model-value="s.name"
                  :required="false"
                  :apply-case="false"
                  :disabled="signatoryDoc.status?.alias !== 'generado'"
                  @update:model-value="updateSignatoryField(idx, 'name', $event)"
                />
                <CommonInputfieldsTextfield
                  classes="col"
                  label="Correo electrónico"
                  placeholder="Correo electrónico *"
                  type="email"
                  :model-value="s.email"
                  :required="false"
                  :apply-case="false"
                  :disabled="signatoryDoc.status?.alias !== 'generado'"
                  :error="signatoryDoc.status?.alias === 'generado' && !s.email.trim() ? 'Requerido' : undefined"
                  @update:model-value="updateSignatoryField(idx, 'email', $event)"
                />
                <CommonInputfieldsSelectfield
                  classes="col-auto"
                  style="width:160px"
                  label="Rol"
                  :data="ROLE_OPTIONS"
                  :model-value="s.role"
                  :disabled="signatoryDoc.status?.alias !== 'generado'"
                  @update:model-value="updateSignatoryField(idx, 'role', $event)"
                />
                <div v-if="signatoryDoc.status?.alias === 'generado'" class="col-auto align-self-end mb-3">
                  <button
                    type="button"
                    class="btn btn-dashed color-1 btn-sm"
                    @click="removeSignatoryRow(idx)"
                  >
                    <i class="fa fa-trash"></i>
                  </button>
                </div>
              </div>
            </form>

            <button
              v-if="signatoryDoc.status?.alias === 'generado'"
              type="button"
              class="btn btn-dashed color-4 btn-sm mt-1"
              @click="addSignatoryRow"
            >
              <i class="bi bi-plus me-1"></i> Agregar firmante
            </button>
          </template>
        </template>
      </div>

      <template #actions>
        <template v-if="signatoryDoc?.status?.alias === 'generado'">
          <button class="btn btn-pill btn-outline-secondary" @click="saveSignatories">
            <i class="fas fa-save me-1"></i> Guardar firmantes
          </button>
          <button
            class="btn btn-pill btn-gradient color-4 ms-2"
            :disabled="!signatoryRowsValid || sendingForSign"
            :title="!signatoryRowsValid ? 'Completa el correo de todos los firmantes' : ''"
            @click="sendForSigning"
          >
            <i v-if="sendingForSign" class="fas fa-spinner fa-spin me-1"></i>
            <i v-else class="fas fa-paper-plane me-1"></i>
            Enviar a firmar
          </button>
        </template>
      </template>
    </CommonModal>

    <!-- Modal: Reenviar correo firmado por firmante -->
    <CommonModal
      v-model:show="showResendSignatoryModal"
      title="Reenviar correo firmado"
      size="sm"
    >
      <div class="p-2">
        <p class="small mb-3">
          Se reenviará el correo con el PDF firmado a <strong>{{ resendSignatoryTarget?.name }}</strong>.
        </p>
        <CommonInputfieldsCheckbox
          v-model="resendSignatoryIncludeCert"
          label="Incluir certificado de evidencias"
          name="include_certificate"
        />
      </div>
      <template #actions>
        <button
          class="btn btn-pill btn-gradient color-4"
          :disabled="resendingCompletionId !== null"
          @click="sendResendCompletionForSignatory"
        >
          <i v-if="resendingCompletionId !== null" class="fas fa-spinner fa-spin me-1"></i>
          <i v-else class="fas fa-paper-plane me-1"></i>
          Reenviar
        </button>
      </template>
    </CommonModal>

    <CommonModal
      v-model:show="showAddModal"
      :title="editingDoc ? 'Editar Documento' : 'Nuevo Documento'"
      size="lg"
      @close="closeModal"
    >
      <form class="admin-form row gx-3">
        <!-- Tipo de plantilla -->
        <CommonInputfieldsSelectfield
          v-model="docForm.document_type_id"
          :data="props.lookups?.documentTemplateTypes ?? []"
          classes="col-md-6"
          label="Tipo de documento"
          labelField="name"
        />

        <!-- Template key (solo lectura, auto-poblado) -->
        <div class="col-md-6">
          <label class="form-label">Plantilla PDF</label>
          <input
            class="form-control"
            :value="docForm.template_key || 'Sin plantilla asignada'"
            readonly
            disabled
          />
        </div>

        <CommonInputfieldsTextfield
          v-model="docForm.title"
          classes="col-12"
          label="Título"
          star="*"
        />

        <CommonInputfieldsSelectfield
          v-model="docForm.document_category_id"
          :data="props.lookups?.documentCategories ?? []"
          classes="col-md-6"
          label="Categoría"
          labelField="name"
        />
        <CommonInputfieldsTextfield
          v-model="docForm.number"
          classes="col-md-6"
          label="N° Documento"
        />
        <CommonInputfieldsSelectfield
          v-model="docForm.status_id"
          :data="props.lookups?.documentStatuses ?? []"
          classes="col-md-6"
          label="Estado"
          labelField="name"
        />
        <div class="col-md-6">
          <label>Fecha del documento</label>
          <VueDatePicker
            v-model="docForm.document_date"
            format="yyyy-MM-dd"
            model-type="yyyy-MM-dd"
            :enable-time-picker="false"
          />
        </div>
        <CommonInputfieldsTextarea
          v-model="docForm.notes"
          classes="col-12"
          label="Notas"
        />

        <!-- Campos específicos de Actas (entrega, devolucion, inspeccion) -->
        <template v-if="isActa">
          <div class="col-12 mt-3">
            <div class="acta-section-title">
              <i class="fas fa-clipboard-list me-1"></i> Contenido del Acta
            </div>
          </div>

          <CommonInputfieldsTextarea
            v-model="docForm.content_property_condition"
            classes="col-12"
            label="Estado del inmueble"
            placeholder="Describa el estado general del inmueble, daños, observaciones..."
          />

          <div class="col-md-6">
            <CommonInputfieldsCheckbox
              v-model="docForm.content_pending_services"
              label="¿Servicios públicos pendientes de pago?"
              name="content_pending_services"
            />
          </div>

          <div class="col-md-6">
            <CommonInputfieldsCheckbox
              v-model="docForm.content_photos_taken"
              label="¿Se tomaron fotografías del inmueble?"
              name="content_photos_taken"
            />
          </div>

          <CommonInputfieldsTextarea
            v-if="docForm.content_pending_services"
            v-model="docForm.content_pending_services_notes"
            classes="col-12"
            label="Detalle de servicios pendientes"
            placeholder="Especifique qué servicios están pendientes y los montos aproximados..."
          />

          <!-- Pagos pendientes -->
          <div class="col-12 mt-2">
            <label class="form-label fw-bold">Obligaciones económicas pendientes</label>
            <div
              v-for="(payment, idx) in docForm.content_pending_payments"
              :key="idx"
              class="row gx-2 mb-2 align-items-center"
            >
              <div class="col">
                <input
                  class="form-control form-control-sm"
                  placeholder="Concepto (ej: Canon mes de octubre)"
                  :value="payment.concept"
                  @input="updatePaymentConcept(idx, ($event.target as HTMLInputElement).value)"
                />
              </div>
              <div class="col-auto" style="width: 160px">
                <input
                  class="form-control form-control-sm"
                  type="number"
                  placeholder="Valor $"
                  :value="payment.amount"
                  @input="updatePaymentAmount(idx, Number(($event.target as HTMLInputElement).value))"
                />
              </div>
              <div class="col-auto">
                <button
                  type="button"
                  class="btn btn-dashed color-1 btn-sm"
                  @click="removePayment(idx)"
                >
                  <i class="fa fa-trash"></i>
                </button>
              </div>
            </div>
            <button
              type="button"
              class="btn btn-dashed color-4 btn-sm mt-1"
              @click="() => addPayment()"
            >
              <i class="bi bi-plus me-1"></i> Agregar obligación
            </button>
          </div>

          <!-- Total calculado -->
          <div v-if="docForm.content_pending_payments.length > 0" class="col-12 mt-2">
            <div class="total-pending-box">
              Total pendiente:
              <strong>$ {{ formatCurrency(docForm.content_total_pending) }}</strong>
            </div>
          </div>

          <CommonInputfieldsTextarea
            v-model="docForm.content_obligations_notes"
            classes="col-12"
            label="Observaciones generales"
            placeholder="Acuerdos, compromisos o notas adicionales para el acta..."
          />

          <!-- Extra para Inspección -->
          <template v-if="contentGroup === 'inspeccion'">
            <CommonInputfieldsTextfield
              v-model="docForm.content_inspector_name"
              classes="col-md-6"
              label="Nombre del inspector"
              placeholder="Ej: Carlos Mejía"
            />
            <div class="col-md-6">
              <label>Próxima inspección</label>
              <VueDatePicker
                v-model="docForm.content_next_inspection_date"
                format="yyyy-MM-dd"
                model-type="yyyy-MM-dd"
                :enable-time-picker="false"
              />
            </div>
          </template>
        </template>

        <!-- Campos: Preaviso de Terminación -->
        <template v-if="contentGroup === 'preaviso'">
          <div class="col-12 mt-3">
            <div class="acta-section-title">
              <i class="fas fa-envelope me-1"></i> Datos del Preaviso
            </div>
          </div>

          <CommonInputfieldsSelectfield
            v-model="docForm.content_sender_role"
            :data="([{ id: 'arrendador', name: 'Arrendador (la inmobiliaria notifica al inquilino)' }, { id: 'arrendatario', name: 'Arrendatario (el inquilino notifica a la inmobiliaria)' }] as any[])"
            classes="col-12"
            label="Quién envía el preaviso"
            labelField="name"
          />

          <div class="col-md-6">
            <label>Fecha de terminación del contrato</label>
            <VueDatePicker
              v-model="docForm.content_termination_date"
              format="yyyy-MM-dd"
              model-type="yyyy-MM-dd"
              :enable-time-picker="false"
            />
          </div>

          <CommonInputfieldsNumberfield
            v-model="docForm.content_days_notice"
            classes="col-md-6"
            label="Días de preaviso"
            placeholder="90"
          />

          <CommonInputfieldsTextarea
            v-model="docForm.content_reason"
            classes="col-12"
            label="Motivación (opcional)"
            placeholder="Razón del no renovación: necesidad personal, venta del inmueble, incumplimiento..."
          />
        </template>

        <!-- Campos: Inventario -->
        <template v-if="contentGroup === 'inventario'">
          <div class="col-12 mt-3">
            <div class="acta-section-title">
              <i class="fas fa-list me-1"></i> Inventario del Inmueble
            </div>
          </div>

          <CommonInputfieldsTextarea
            v-model="docForm.content_general_condition"
            classes="col-12"
            label="Estado general del inmueble"
            placeholder="Describa el estado general: pisos, paredes, ventanas, instalaciones..."
          />

          <div class="col-md-6">
            <CommonInputfieldsCheckbox
              v-model="docForm.content_photos_taken"
              label="¿Se tomaron fotografías?"
              name="inv_photos_taken"
            />
          </div>

          <!-- Tabla de ítems del inventario -->
          <div class="col-12 mt-2">
            <label class="form-label fw-bold">Elementos del inventario</label>
            <div
              v-for="(item, idx) in docForm.content_inventory_items"
              :key="idx"
              class="row gx-2 mb-2 align-items-center"
            >
              <div class="col">
                <input
                  class="form-control form-control-sm"
                  placeholder="Elemento (ej: Sofá de sala)"
                  :value="item.name"
                  @input="updateInventoryItem(idx, 'name', ($event.target as HTMLInputElement).value)"
                />
              </div>
              <div class="col-auto" style="width: 80px">
                <input
                  class="form-control form-control-sm"
                  type="number"
                  min="1"
                  placeholder="Cant."
                  :value="item.quantity"
                  @input="updateInventoryItem(idx, 'quantity', Number(($event.target as HTMLInputElement).value))"
                />
              </div>
              <div class="col-auto" style="width: 130px">
                <select
                  class="form-select form-select-sm"
                  :value="item.condition"
                  @change="updateInventoryItem(idx, 'condition', ($event.target as HTMLSelectElement).value)"
                >
                  <option value="bueno">Bueno</option>
                  <option value="regular">Regular</option>
                  <option value="malo">Malo</option>
                </select>
              </div>
              <div class="col">
                <input
                  class="form-control form-control-sm"
                  placeholder="Observaciones"
                  :value="item.notes"
                  @input="updateInventoryItem(idx, 'notes', ($event.target as HTMLInputElement).value)"
                />
              </div>
              <div class="col-auto">
                <button
                  type="button"
                  class="btn btn-dashed color-1 btn-sm"
                  @click="removeInventoryItem(idx)"
                ><i class="fa fa-trash"></i></button>
              </div>
            </div>
            <button
              type="button"
              class="btn btn-dashed color-4 btn-sm mt-1"
              @click="addInventoryItem"
            >
              <i class="bi bi-plus me-1"></i> Agregar elemento
            </button>
          </div>

          <CommonInputfieldsTextarea
            v-model="docForm.content_inventory_notes"
            classes="col-12"
            label="Observaciones adicionales"
            placeholder="Bienes incluidos con el inmueble, acuerdos especiales..."
          />
        </template>

        <!-- Campos: Póliza de Seguro -->
        <template v-if="contentGroup === 'poliza'">
          <div class="col-12 mt-3">
            <div class="acta-section-title">
              <i class="fas fa-shield-alt me-1"></i> Datos de la Póliza
            </div>
          </div>

          <CommonInputfieldsTextfield
            v-model="docForm.content_insurer_name"
            classes="col-md-6"
            label="Aseguradora"
            placeholder="Ej: Mapfre, Allianz, Sura..."
            star="*"
          />
          <CommonInputfieldsTextfield
            v-model="docForm.content_policy_number"
            classes="col-md-6"
            label="N° Póliza"
            star="*"
          />

          <CommonInputfieldsNumberfield
            v-model="docForm.content_coverage_amount"
            classes="col-md-6"
            label="Suma asegurada ($)"
          />
          <CommonInputfieldsNumberfield
            v-model="docForm.content_premium_amount"
            classes="col-md-6"
            label="Prima mensual ($)"
          />

          <div class="col-md-6">
            <label>Vigencia desde</label>
            <VueDatePicker
              v-model="docForm.content_policy_start_date"
              format="yyyy-MM-dd"
              model-type="yyyy-MM-dd"
              :enable-time-picker="false"
            />
          </div>
          <div class="col-md-6">
            <label>Vigencia hasta</label>
            <VueDatePicker
              v-model="docForm.content_policy_end_date"
              format="yyyy-MM-dd"
              model-type="yyyy-MM-dd"
              :enable-time-picker="false"
            />
          </div>

          <CommonInputfieldsTextfield
            v-model="docForm.content_beneficiary"
            classes="col-12"
            label="Beneficiario (si difiere de la inmobiliaria)"
          />
        </template>

        <!-- Campos: Garantía Codeudor -->
        <template v-if="contentGroup === 'garantia'">
          <div class="col-12 mt-3">
            <div class="acta-section-title">
              <i class="fas fa-handshake me-1"></i> Datos de la Garantía
            </div>
          </div>

          <CommonInputfieldsSelectfield
            v-model="docForm.content_guarantee_type"
            :data="([{ id: 'solidaria', name: 'Garantía Solidaria' }, { id: 'subsidiaria', name: 'Garantía Subsidiaria' }, { id: 'hipotecaria', name: 'Garantía Hipotecaria' }] as any[])"
            classes="col-md-6"
            label="Tipo de garantía"
            labelField="name"
          />

          <CommonInputfieldsTextarea
            v-model="docForm.content_guarantee_observations"
            classes="col-12"
            label="Observaciones"
            placeholder="Alcance de la garantía, condiciones especiales..."
          />
        </template>

        <!-- Campos: Factura Canon -->
        <template v-if="contentGroup === 'factura_canon'">
          <div class="col-12 mt-3">
            <div class="acta-section-title">
              <i class="fas fa-file-invoice-dollar me-1"></i> Datos de la Factura
            </div>
          </div>

          <div class="col-md-6">
            <label>Período desde</label>
            <VueDatePicker
              v-model="docForm.content_period_from"
              format="yyyy-MM-dd"
              model-type="yyyy-MM-dd"
              :enable-time-picker="false"
            />
          </div>
          <div class="col-md-6">
            <label>Período hasta</label>
            <VueDatePicker
              v-model="docForm.content_period_to"
              format="yyyy-MM-dd"
              model-type="yyyy-MM-dd"
              :enable-time-picker="false"
            />
          </div>

          <div class="col-md-6">
            <label>Fecha límite de pago</label>
            <VueDatePicker
              v-model="docForm.content_payment_due_date"
              format="yyyy-MM-dd"
              model-type="yyyy-MM-dd"
              :enable-time-picker="false"
            />
          </div>

          <CommonInputfieldsNumberfield
            v-model="docForm.content_late_fee"
            classes="col-md-6"
            label="Mora / Intereses ($)"
            placeholder="0"
          />
        </template>

        <!-- Campos: Liquidación Final (reutiliza lista de pagos) -->
        <template v-if="contentGroup === 'factura_liquidacion'">
          <div class="col-12 mt-3">
            <div class="acta-section-title">
              <i class="fas fa-balance-scale me-1"></i> Ítems de la Liquidación
            </div>
          </div>

          <div class="col-12 mt-1">
            <label class="form-label fw-bold">Cargos y abonos</label>
            <div
              v-for="(payment, idx) in docForm.content_pending_payments"
              :key="idx"
              class="row gx-2 mb-2 align-items-center"
            >
              <div class="col-auto" style="width: 120px">
                <select
                  class="form-select form-select-sm"
                  :value="payment.type ?? 'debit'"
                  @change="updatePaymentType(idx, ($event.target as HTMLSelectElement).value as 'debit' | 'credit')"
                >
                  <option value="debit">Cargo</option>
                  <option value="credit">Abono</option>
                </select>
              </div>
              <div class="col">
                <input
                  class="form-control form-control-sm"
                  placeholder="Concepto (ej: Canon octubre, Depósito devuelto)"
                  :value="payment.concept"
                  @input="updatePaymentConcept(idx, ($event.target as HTMLInputElement).value)"
                />
              </div>
              <div class="col-auto" style="width: 140px">
                <input
                  class="form-control form-control-sm"
                  type="number"
                  placeholder="Valor $"
                  :value="payment.amount"
                  @input="updatePaymentAmount(idx, Number(($event.target as HTMLInputElement).value))"
                />
              </div>
              <div class="col-auto">
                <button
                  type="button"
                  class="btn btn-dashed color-1 btn-sm"
                  @click="removePayment(idx)"
                ><i class="fa fa-trash"></i></button>
              </div>
            </div>
            <div class="d-flex gap-2 mt-1">
              <button type="button" class="btn btn-dashed color-4 btn-sm" @click="addPayment('debit')">
                <i class="bi bi-plus me-1"></i> Cargo
              </button>
              <button type="button" class="btn btn-dashed color-4 btn-sm" @click="addPayment('credit')">
                <i class="bi bi-plus me-1"></i> Abono
              </button>
            </div>
          </div>

          <div v-if="docForm.content_pending_payments.length > 0" class="col-12 mt-2">
            <div class="total-pending-box">
              Total: <strong>$ {{ formatCurrency(docForm.content_total_pending) }}</strong>
            </div>
          </div>

          <CommonInputfieldsTextarea
            v-model="docForm.content_obligations_notes"
            classes="col-12"
            label="Observaciones de la liquidación"
          />
        </template>

        <!-- Campos: Contratos especiales (mandato, comodato, colocacion) -->
        <template v-if="contentGroup === 'contrato'">
          <div class="col-12 mt-3">
            <div class="acta-section-title">
              <i class="fas fa-file-contract me-1"></i> Datos del Contrato
            </div>
          </div>

          <!-- Mandato: comisión -->
          <CommonInputfieldsNumberfield
            v-if="docForm.template_key === 'administracion_mandato'"
            v-model="docForm.content_commission_percentage"
            classes="col-md-6"
            label="Comisión de administración (%)"
            placeholder="10"
          />

          <!-- Comodato: finalidad de uso -->
          <CommonInputfieldsTextarea
            v-if="docForm.template_key === 'comodato'"
            v-model="docForm.content_comodatario_purpose"
            classes="col-12"
            label="Finalidad del comodato"
            placeholder="Describa el uso permitido: habitación familiar, sede temporal de oficina..."
          />

          <!-- Colocación: honorarios -->
          <CommonInputfieldsNumberfield
            v-if="docForm.template_key === 'colocacion'"
            v-model="docForm.content_placement_fee"
            classes="col-md-6"
            label="Honorarios de colocación ($)"
            placeholder="2500000"
          />
          <CommonInputfieldsTextarea
            v-if="docForm.template_key === 'colocacion'"
            v-model="docForm.content_placement_fee_notes"
            classes="col-12"
            label="Detalle de honorarios"
            placeholder="Condiciones de pago, equivalencia en meses de canon..."
          />

          <!-- Cláusulas adicionales (todas) -->
          <div class="col-12 mt-2">
            <label class="form-label fw-bold">Cláusulas adicionales</label>
            <div
              v-for="(clause, idx) in docForm.content_clauses_additional"
              :key="idx"
              class="row gx-2 mb-2 align-items-start"
            >
              <div class="col">
                <textarea
                  class="form-control form-control-sm"
                  rows="2"
                  :placeholder="'Cláusula ' + (idx + 1)"
                  :value="clause"
                  @input="updateClause(idx, ($event.target as HTMLTextAreaElement).value)"
                />
              </div>
              <div class="col-auto">
                <button
                  type="button"
                  class="btn btn-dashed color-1 btn-sm"
                  @click="removeClause(idx)"
                ><i class="fa fa-trash"></i></button>
              </div>
            </div>
            <button
              type="button"
              class="btn btn-dashed color-4 btn-sm mt-1"
              @click="addClause"
            >
              <i class="bi bi-plus me-1"></i> Agregar cláusula
            </button>
          </div>

          <CommonInputfieldsTextarea
            v-model="docForm.content_contract_notes"
            classes="col-12"
            label="Notas internas del documento"
            placeholder="Observaciones o instrucciones adicionales para este documento..."
          />
        </template>
      </form>

      <template #actions>
        <button class="btn btn-pill btn-gradient color-4" @click="saveDocument">
          {{ editingDoc ? "Actualizar" : "Guardar" }}
        </button>
      </template>
    </CommonModal>
  </div>
</template>

<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";
import { useApiHandler } from "~/composables/useApiHandler";
import AlertService from "~/services/AlertService";
import RentService from "~/services/RentService";
import DocumentSignatoryService from "~/services/DocumentSignatoryService";
import type { ILookup } from "~/interfaces/ILookup";
import type { IDocumentSignatory, SignatoryRole } from "~/interfaces/IDocumentSignatory";

interface PendingPayment {
  concept: string;
  amount: number;
  type?: "debit" | "credit";
}

interface InventoryItem {
  name: string;
  quantity: number;
  condition: string;
  notes: string;
}

type ContentGroup =
  | "acta"
  | "inspeccion"
  | "preaviso"
  | "inventario"
  | "poliza"
  | "garantia"
  | "factura_canon"
  | "factura_liquidacion"
  | "contrato"
  | null;

const props = defineProps<{
  rentId?: string | null;
  lookups?: {
    documentCategories?: ILookup[];
    documentStatuses?: ILookup[];
    documentTemplateTypes?: ILookup[];
  };
}>();

const { run } = useApiHandler();
const { can } = useAuthorization();

const ROLE_LABELS: Record<string, string> = {
  arrendatario: "Arrendatario",
  arrendador: "Arrendador",
  codeudor: "Codeudor",
  propietario: "Propietario",
  custom: "Otro",
};

const ROLE_OPTIONS = Object.entries(ROLE_LABELS).map(([id, name]) => ({ id, name }));

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  viewed: "Visto",
  signed: "Firmado",
  rejected: "Rechazado",
  expired: "Expirado",
};

const signatoryStatusBadge = (status?: string) => {
  const map: Record<string, string> = {
    pending: "bg-secondary",
    viewed: "bg-info",
    signed: "bg-success",
    rejected: "bg-danger",
    expired: "bg-warning text-dark",
    generado: "bg-primary",
    enviado: "bg-info",
    firmado: "bg-success",
    borrador: "bg-secondary",
  };
  return map[status ?? ""] ?? "bg-secondary";
};

const documents = ref<any[]>([]);
const showAddModal = ref(false);
const editingDoc = ref<any>(null);
const downloadingId = ref<string | null>(null);

const docActions = (doc: any) => [
  {
    label: doc.generated_at ? "Regenerar PDF" : "Generar PDF",
    icon: "fas fa-file-pdf",
    show: can("documents.generate") && !!doc.template_key && TEMPLATES_WITH_BLADE.has(doc.template_key),
    onClick: () => generatePdf(doc),
  },
  {
    label: downloadingId.value === doc.id ? "Descargando…" : "Descargar PDF",
    icon: "fas fa-download",
    show: can("documents.export") && !!doc.generated_at,
    onClick: () => downloadDocument(doc),
  },
  {
    label: "Firma electrónica",
    icon: "fas fa-signature",
    show: can("documents.sign") && !!doc.template_key && TEMPLATES_WITH_BLADE.has(doc.template_key) && ['generado', 'enviado', 'firmado'].includes(doc.status?.alias ?? ''),
    onClick: () => openSignatoryModal(doc),
  },
  {
    label: "Certificado de evidencias",
    icon: "fas fa-certificate",
    show: can("documents.export") && doc.status?.alias === 'firmado',
    onClick: () => downloadCertificate(doc),
  },
  { divider: true, show: can("documents.create") || can("documents.delete") },
  {
    label: "Editar",
    icon: "fas fa-pen",
    show: can("documents.create"),
    onClick: () => editDocument(doc),
  },
  {
    label: "Eliminar",
    icon: "fa fa-trash",
    variant: "danger",
    show: can("documents.delete"),
    onClick: () => deleteDocument(doc),
  },
];

// ── Firma electrónica ────────────────────────────────────────────────────────
const showSignatoryModal = ref(false);
const signatoryDoc = ref<any>(null);
const signatories = ref<IDocumentSignatory[]>([]);
const signatoryRows = ref<Pick<IDocumentSignatory, 'person_id' | 'name' | 'email' | 'role' | 'order'>[]>([]);
const proposedSignatories = ref(false);
const loadingSignatories = ref(false);
const sendingForSign = ref(false);
const resendingId = ref<string | null>(null);
const downloadingCert = ref(false);
const downloadingTsr = ref(false);
const downloadingTsq = ref(false);
const resendingCompletionId = ref<string | null>(null);
const showResendSignatoryModal = ref(false);
const resendSignatoryTarget = ref<IDocumentSignatory | null>(null);
const resendSignatoryIncludeCert = ref(false);

const openSignatoryModal = async (doc: any) => {
  signatoryDoc.value = doc;
  signatories.value = [];
  signatoryRows.value = [];
  proposedSignatories.value = false;
  showSignatoryModal.value = true;
  loadingSignatories.value = true;

  try {
    const res = await run(DocumentSignatoryService.getSignatories(props.rentId!, doc.id));
    if (res) {
      const list: IDocumentSignatory[] = res.data?.data ?? res.data ?? [];
      if (res.data?.proposed) {
        proposedSignatories.value = true;
        signatoryRows.value = list.map((s, i) => ({
          person_id: s.person_id ?? null,
          name: s.name,
          email: s.email,
          role: s.role,
          order: i + 1,
        }));
      } else {
        signatories.value = list;
        if (['generado', 'firmado'].includes(doc.status?.alias ?? '')) {
          signatoryRows.value = list.map((s, i) => ({
            person_id: s.person_id ?? null,
            name: s.name,
            email: s.email,
            role: s.role,
            order: i + 1,
          }));
        }
      }
    }
  } finally {
    loadingSignatories.value = false;
  }
};

const closeSignatoryModal = () => {
  showSignatoryModal.value = false;
  signatoryDoc.value = null;
  signatories.value = [];
  signatoryRows.value = [];
};

const addSignatoryRow = () => {
  signatoryRows.value = [
    ...signatoryRows.value,
    { person_id: null, name: "", email: "", role: "arrendatario" as SignatoryRole, order: signatoryRows.value.length + 1 },
  ];
};

const removeSignatoryRow = (idx: number) => {
  signatoryRows.value = signatoryRows.value.filter((_, i) => i !== idx).map((s, i) => ({ ...s, order: i + 1 }));
};

const updateSignatoryField = (idx: number, field: string, val: string) => {
  const arr = [...signatoryRows.value];
  (arr[idx] as any)[field] = val;
  signatoryRows.value = arr;
};

const signatoryRowsValid = computed(() =>
  signatoryRows.value.length > 0 &&
  signatoryRows.value.every((s) => s.name.trim() && s.email.trim()),
);

const saveSignatories = async (): Promise<boolean> => {
  if (!props.rentId || !signatoryDoc.value) return false;

  const missing = signatoryRows.value.filter((s) => !s.email.trim());
  if (missing.length > 0) {
    AlertService.showError("Correo requerido", `Completa el correo de: ${missing.map((s) => s.name || "firmante sin nombre").join(", ")}`);
    return false;
  }

  const res = await run(
    DocumentSignatoryService.storeSignatories(props.rentId, signatoryDoc.value.id, signatoryRows.value),
    { showSuccess: true, successMessage: "Firmantes guardados correctamente" },
  );
  if (res) {
    const list: IDocumentSignatory[] = res.data?.data ?? res.data ?? [];
    signatories.value = list;
    proposedSignatories.value = false;
    return true;
  }
  return false;
};

const sendForSigning = async () => {
  if (!props.rentId || !signatoryDoc.value) return;

  if (signatoryRows.value.length > 0) {
    const saved = await saveSignatories();
    if (!saved) return;
  }

  sendingForSign.value = true;
  try {
    const res = await run(
      DocumentSignatoryService.sendForSigning(props.rentId, signatoryDoc.value.id),
      { showSuccess: true, successMessage: "Documento enviado a firmar" },
    );
    if (res) {
      closeSignatoryModal();
      await loadDocuments();
    }
  } finally {
    sendingForSign.value = false;
  }
};

const resendSignatory = async (signatory: IDocumentSignatory) => {
  if (!props.rentId || !signatoryDoc.value || !signatory.id) return;
  resendingId.value = signatory.id;
  try {
    await run(
      DocumentSignatoryService.resendSignatory(props.rentId, signatoryDoc.value.id, signatory.id),
      { showSuccess: true, successMessage: "Correo reenviado" },
    );
  } finally {
    resendingId.value = null;
  }
};

const downloadTsrFile = async (doc: any) => {
  if (!props.rentId || downloadingTsr.value) return;
  downloadingTsr.value = true;
  try {
    const blob = await run<Blob>(DocumentSignatoryService.downloadTsr(props.rentId, doc.id));
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sello_rfc3161_${doc.number ?? doc.id}.tsr`;
      a.click();
      URL.revokeObjectURL(url);
    }
  } finally {
    downloadingTsr.value = false;
  }
};

const downloadTsqFile = async (doc: any) => {
  if (!props.rentId || downloadingTsq.value) return;
  downloadingTsq.value = true;
  try {
    const blob = await run<Blob>(DocumentSignatoryService.downloadTsq(props.rentId, doc.id));
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `peticion_tsa_${doc.number ?? doc.id}.tsq`;
      a.click();
      URL.revokeObjectURL(url);
    }
  } finally {
    downloadingTsq.value = false;
  }
};

const downloadCertificate = async (doc: any) => {
  if (!props.rentId || downloadingCert.value) return;
  downloadingCert.value = true;
  try {
    const blob = await run<Blob>(DocumentSignatoryService.downloadCertificate(props.rentId, doc.id));
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificado_evidencias_${doc.number ?? doc.id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    }
  } finally {
    downloadingCert.value = false;
  }
};

const openResendSignatoryModal = (signatory: IDocumentSignatory) => {
  resendSignatoryTarget.value = signatory;
  resendSignatoryIncludeCert.value = false;
  showResendSignatoryModal.value = true;
};

const sendResendCompletionForSignatory = async () => {
  if (!props.rentId || !signatoryDoc.value || !resendSignatoryTarget.value?.id) return;
  resendingCompletionId.value = resendSignatoryTarget.value.id;
  try {
    await run(
      DocumentSignatoryService.resendCompletionForSignatory(
        props.rentId,
        signatoryDoc.value.id,
        resendSignatoryTarget.value.id,
        resendSignatoryIncludeCert.value,
      ),
      { showSuccess: true, successMessage: "Correo firmado reenviado" },
    );
    showResendSignatoryModal.value = false;
  } finally {
    resendingCompletionId.value = null;
  }
};

const emptyDocForm = () => ({
  title: "",
  document_type_id: "",
  document_category_id: "",
  number: "",
  status_id: "",
  document_date: "",
  notes: "",
  template_key: "",
  // Acta (entrega / devolucion / inspeccion)
  content_property_condition: "",
  content_pending_services: false,
  content_pending_services_notes: "",
  content_pending_payments: [] as PendingPayment[],
  content_total_pending: 0,
  content_photos_taken: false,
  content_obligations_notes: "",
  content_inspector_name: "",
  content_next_inspection_date: "",
  // Preaviso
  content_sender_role: "arrendador" as "arrendador" | "arrendatario",
  content_termination_date: "",
  content_days_notice: 90,
  content_reason: "",
  // Inventario
  content_general_condition: "",
  content_inventory_notes: "",
  content_inventory_items: [] as InventoryItem[],
  // Contratos especiales (mandato, comodato, colocacion)
  content_commission_percentage: 0,
  content_comodatario_purpose: "",
  content_placement_fee: 0,
  content_placement_fee_notes: "",
  content_contract_notes: "",
  // Póliza
  content_insurer_name: "",
  content_policy_number: "",
  content_coverage_amount: 0,
  content_premium_amount: 0,
  content_policy_start_date: "",
  content_policy_end_date: "",
  content_beneficiary: "",
  // Garantía
  content_guarantee_type: "solidaria",
  content_guarantee_observations: "",
  // Factura canon
  content_period_from: "",
  content_period_to: "",
  content_payment_due_date: "",
  content_late_fee: 0,
  // Contratos adicionales
  content_clauses_additional: [] as string[],
});

const docForm = ref(emptyDocForm());

// Auto-poblar template_key al seleccionar tipo de documento
watch(
  () => docForm.value.document_type_id,
  (typeId) => {
    const type = (props.lookups?.documentTemplateTypes ?? []).find((t) => t.id === typeId);
    docForm.value.template_key = type?.code ?? "";
  },
);

// Recalcular total pendiente cuando cambian los pagos
watch(
  () => docForm.value.content_pending_payments,
  (payments) => {
    docForm.value.content_total_pending = payments.reduce(
      (sum, p) => sum + (Number(p.amount) || 0),
      0,
    );
  },
  { deep: true },
);

const selectedTemplateType = computed(() =>
  (props.lookups?.documentTemplateTypes ?? []).find(
    (t) => t.id === docForm.value.document_type_id,
  ),
);

const contentGroup = computed((): ContentGroup => {
  const code = selectedTemplateType.value?.code ?? "";
  if (code === "entrega_inmueble" || code === "devolucion_inmueble") return "acta";
  if (code === "inspeccion") return "inspeccion";
  if (code === "preaviso_terminacion") return "preaviso";
  if (code === "inventario_inmueble") return "inventario";
  if (code === "seguro_arrendamiento") return "poliza";
  if (code === "codeudor") return "garantia";
  if (code === "canon") return "factura_canon";
  if (code === "liquidacion") return "factura_liquidacion";
  if (["administracion_mandato", "comodato", "colocacion"].includes(code)) return "contrato";
  return null;
});

const isActa = computed(
  () => contentGroup.value === "acta" || contentGroup.value === "inspeccion",
);

const TEMPLATES_WITH_BLADE = new Set([
  "arrendamiento_vivienda",
  "arrendamiento_comercial",
  "administracion_mandato",
  "comodato",
  "colocacion",
  "entrega_inmueble",
  "devolucion_inmueble",
  "inspeccion",
  "canon",
  "liquidacion",
  "seguro_arrendamiento",
  "codeudor",
  "inventario_inmueble",
  "preaviso_terminacion",
]);

const canGeneratePdf = computed(
  () => !!docForm.value.template_key && TEMPLATES_WITH_BLADE.has(docForm.value.template_key),
);

const formatCurrency = (value: number) =>
  value.toLocaleString("es-CO", { minimumFractionDigits: 0 });

const addPayment = (type: "debit" | "credit" = "debit") => {
  docForm.value.content_pending_payments = [
    ...docForm.value.content_pending_payments,
    { concept: "", amount: 0, type },
  ];
};

const addInventoryItem = () => {
  docForm.value.content_inventory_items = [
    ...docForm.value.content_inventory_items,
    { name: "", quantity: 1, condition: "bueno", notes: "" },
  ];
};

const removeInventoryItem = (idx: number) => {
  docForm.value.content_inventory_items = docForm.value.content_inventory_items.filter(
    (_, i) => i !== idx,
  );
};

const updateInventoryItem = (idx: number, field: keyof InventoryItem, val: string | number) => {
  const arr = [...docForm.value.content_inventory_items];
  arr[idx] = { ...arr[idx], [field]: val } as InventoryItem;
  docForm.value.content_inventory_items = arr;
};

const addClause = () => {
  docForm.value.content_clauses_additional = [...docForm.value.content_clauses_additional, ""];
};

const removeClause = (idx: number) => {
  docForm.value.content_clauses_additional = docForm.value.content_clauses_additional.filter(
    (_, i) => i !== idx,
  );
};

const updateClause = (idx: number, val: string) => {
  const arr = [...docForm.value.content_clauses_additional];
  arr[idx] = val;
  docForm.value.content_clauses_additional = arr;
};

const removePayment = (idx: number) => {
  docForm.value.content_pending_payments = docForm.value.content_pending_payments.filter(
    (_, i) => i !== idx,
  );
};

const updatePaymentConcept = (idx: number, val: string) => {
  const arr = [...docForm.value.content_pending_payments];
  arr[idx] = { ...arr[idx], concept: val } as PendingPayment;
  docForm.value.content_pending_payments = arr;
};

const updatePaymentAmount = (idx: number, val: number) => {
  const arr = [...docForm.value.content_pending_payments];
  arr[idx] = { ...arr[idx], amount: val } as PendingPayment;
  docForm.value.content_pending_payments = arr;
};

const updatePaymentType = (idx: number, val: "debit" | "credit") => {
  const arr = [...docForm.value.content_pending_payments];
  arr[idx] = { ...arr[idx], type: val } as PendingPayment;
  docForm.value.content_pending_payments = arr;
};

const normalizeDocStatus = (doc: any) => {
  if (!doc.status) return doc;
  return { ...doc, status: { ...doc.status, alias: doc.status.alias?.toLowerCase() } };
};

const loadDocuments = async () => {
  if (!props.rentId) return;
  const response = await run(RentService.getDocuments(props.rentId));
  if (response) {
    const raw = response.data?.data ?? response.data ?? [];
    documents.value = raw.map(normalizeDocStatus);
  }
};

const editDocument = (doc: any) => {
  editingDoc.value = doc;
  const c = doc.content ?? {};
  docForm.value = {
    title: doc.title ?? "",
    document_type_id: doc.document_type_id ?? "",
    document_category_id: doc.document_category_id ?? "",
    number: doc.number ?? "",
    status_id: doc.status_id ?? "",
    document_date: doc.document_date ?? "",
    notes: doc.notes ?? "",
    template_key: doc.template_key ?? "",
    // Acta / Inspeccion
    content_property_condition: c.property_condition ?? "",
    content_pending_services: c.pending_services ?? false,
    content_pending_services_notes: c.pending_services_notes ?? "",
    content_pending_payments: c.pending_payments ?? [],
    content_total_pending: c.total_pending ?? 0,
    content_photos_taken: c.photos_taken ?? false,
    content_obligations_notes: c.obligations_notes ?? "",
    content_inspector_name: c.inspector_name ?? "",
    content_next_inspection_date: c.next_inspection_date ?? "",
    // Preaviso
    content_sender_role: c.sender_role ?? "arrendador",
    content_termination_date: c.termination_date ?? "",
    content_days_notice: c.days_notice ?? 90,
    content_reason: c.reason ?? "",
    // Inventario
    content_general_condition: c.general_condition ?? "",
    content_inventory_notes: c.inventory_notes ?? "",
    content_inventory_items: (c.items ?? []) as InventoryItem[],
    // Contratos especiales
    content_commission_percentage: c.commission_percentage ?? 0,
    content_comodatario_purpose: c.comodatario_purpose ?? "",
    content_placement_fee: c.placement_fee ?? 0,
    content_placement_fee_notes: c.placement_fee_notes ?? "",
    content_contract_notes: c.notes ?? "",
    // Póliza
    content_insurer_name: c.insurer_name ?? "",
    content_policy_number: c.policy_number ?? "",
    content_coverage_amount: c.coverage_amount ?? 0,
    content_premium_amount: c.premium_amount ?? 0,
    content_policy_start_date: c.policy_start_date ?? "",
    content_policy_end_date: c.policy_end_date ?? "",
    content_beneficiary: c.beneficiary ?? "",
    // Garantía
    content_guarantee_type: c.guarantee_type ?? "solidaria",
    content_guarantee_observations: c.guarantee_observations ?? "",
    // Factura canon
    content_period_from: c.period_from ?? "",
    content_period_to: c.period_to ?? "",
    content_payment_due_date: c.payment_due_date ?? "",
    content_late_fee: c.late_fee ?? 0,
    // Contratos adicionales
    content_clauses_additional: c.clauses_additional ?? [],
  };
  showAddModal.value = true;
};

const closeModal = () => {
  showAddModal.value = false;
  editingDoc.value = null;
  docForm.value = emptyDocForm();
};

const buildPayload = () => {
  const base: Record<string, any> = {
    title: docForm.value.title,
    document_type_id: docForm.value.document_type_id || null,
    document_category_id: docForm.value.document_category_id || null,
    number: docForm.value.number || null,
    status_id: docForm.value.status_id || null,
    document_date: docForm.value.document_date || null,
    notes: docForm.value.notes || null,
    template_key: docForm.value.template_key || null,
  };

  const group = contentGroup.value;

  if (group === "acta" || group === "inspeccion") {
    base.content = {
      property_condition: docForm.value.content_property_condition || null,
      pending_services: docForm.value.content_pending_services,
      pending_services_notes: docForm.value.content_pending_services_notes || null,
      pending_payments: docForm.value.content_pending_payments,
      total_pending: docForm.value.content_total_pending,
      photos_taken: docForm.value.content_photos_taken,
      obligations_notes: docForm.value.content_obligations_notes || null,
      ...(group === "inspeccion" && {
        inspector_name: docForm.value.content_inspector_name || null,
        next_inspection_date: docForm.value.content_next_inspection_date || null,
      }),
    };
  } else if (group === "preaviso") {
    base.content = {
      sender_role: docForm.value.content_sender_role,
      termination_date: docForm.value.content_termination_date || null,
      days_notice: docForm.value.content_days_notice,
      reason: docForm.value.content_reason || null,
    };
  } else if (group === "inventario") {
    base.content = {
      general_condition: docForm.value.content_general_condition || null,
      inventory_notes: docForm.value.content_inventory_notes || null,
      photos_taken: docForm.value.content_photos_taken,
      items:
        docForm.value.content_inventory_items.length > 0
          ? docForm.value.content_inventory_items
          : undefined,
    };
  } else if (group === "contrato") {
    const key = docForm.value.template_key;
    const content: Record<string, any> = {
      clauses_additional: docForm.value.content_clauses_additional.filter(Boolean),
      notes: docForm.value.content_contract_notes || null,
    };
    if (key === "administracion_mandato") {
      content.commission_percentage = docForm.value.content_commission_percentage || null;
    } else if (key === "comodato") {
      content.comodatario_purpose = docForm.value.content_comodatario_purpose || null;
    } else if (key === "colocacion") {
      content.placement_fee = docForm.value.content_placement_fee || null;
      content.placement_fee_notes = docForm.value.content_placement_fee_notes || null;
    }
    base.content = content;
  } else if (group === "poliza") {
    base.content = {
      insurer_name: docForm.value.content_insurer_name || null,
      policy_number: docForm.value.content_policy_number || null,
      coverage_amount: docForm.value.content_coverage_amount || 0,
      premium_amount: docForm.value.content_premium_amount || 0,
      policy_start_date: docForm.value.content_policy_start_date || null,
      policy_end_date: docForm.value.content_policy_end_date || null,
      beneficiary: docForm.value.content_beneficiary || null,
    };
  } else if (group === "garantia") {
    base.content = {
      guarantee_type: docForm.value.content_guarantee_type || "solidaria",
      guarantee_observations: docForm.value.content_guarantee_observations || null,
    };
  } else if (group === "factura_canon") {
    base.content = {
      period_from: docForm.value.content_period_from || null,
      period_to: docForm.value.content_period_to || null,
      payment_due_date: docForm.value.content_payment_due_date || null,
      late_fee: docForm.value.content_late_fee || 0,
    };
  } else if (group === "factura_liquidacion") {
    base.content = {
      pending_payments: docForm.value.content_pending_payments,
      total_pending: docForm.value.content_total_pending,
      obligations_notes: docForm.value.content_obligations_notes || null,
    };
  }

  return { document: base };
};

const saveDocument = async () => {
  if (!props.rentId || !docForm.value.title) return;

  const payload = buildPayload();

  const promise = editingDoc.value
    ? RentService.updateDocument(props.rentId, editingDoc.value.id, payload)
    : RentService.createDocument(props.rentId, payload);

  const response = await run(promise, {
    showSuccess: true,
    successMessage: editingDoc.value
      ? "Documento actualizado correctamente"
      : "Documento creado correctamente",
  });

  if (response) {
    closeModal();
    await loadDocuments();
  }
};

const generatePdf = async (doc: any) => {
  if (!props.rentId) return;

  const response = await run(RentService.generateDocument(props.rentId, doc.id), {
    showSuccess: true,
    successMessage: "PDF generado correctamente",
  });

  if (response) await loadDocuments();
};

const downloadDocument = async (doc: any) => {
  if (!props.rentId || downloadingId.value) return;
  downloadingId.value = doc.id;

  const blob = await run<Blob>(RentService.downloadDocument(props.rentId, doc.id));

  if (blob) {
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = doc.file_name ?? "documento.pdf";
    anchor.click();
    URL.revokeObjectURL(objectUrl);
  }

  downloadingId.value = null;
};

const deleteDocument = async (doc: any) => {
  if (!props.rentId) return;

  const result = await AlertService.showConfirmation(
    "¿Está seguro?",
    `Eliminar documento: ${doc.title}`,
  );

  if (!result.isConfirmed) return;

  const response = await run(
    RentService.deleteDocument(props.rentId, doc.id),
    { showSuccess: true, successMessage: "Documento eliminado correctamente" },
  );

  if (response) await loadDocuments();
};

watch(
  () => props.rentId,
  (id) => {
    if (id) loadDocuments();
  },
  { immediate: true },
);
</script>

<style scoped>
.acta-section-title {
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #586167;
  background: #f7f7fe;
  border-left: 3px solid #6366f1;
  padding: 6px 10px;
  margin-bottom: 4px;
}

.total-pending-box {
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 0.9rem;
}

.signatory-row {
  padding: 4px 0;
  border-bottom: 1px solid #f0f0f0;
}

.signatory-row:last-child {
  border-bottom: none;
}

.signatories-table th,
.signatories-table td {
  font-size: 0.82rem;
  vertical-align: middle;
}

:global(body.dark-layout) .signatory-row {
  border-bottom-color: #2a2a2a;
}

:global(body.dark-layout) .signatories-table th,
:global(body.dark-layout) .signatories-table td {
  color: rgba(255, 255, 255, 0.82);
  background-color: #232323;
  border-color: #383434;
}

:global(body.dark-layout) .acta-section-title {
  color: rgba(255, 255, 255, 0.9);
  background: #1b1b1b;
  border-left-color: #818cf8;
}

:global(body.dark-layout) .total-pending-box {
  background: #3a2f00;
  border-color: #7a6000;
  color: rgba(255, 255, 255, 0.85);
}
</style>

<style>
body.dark-layout .rents-docs-table th,
body.dark-layout .rents-docs-table td {
  color: rgba(255, 255, 255, 0.82) !important;
  background-color: #232323 !important;
  border-color: #383434 !important;
}
body.dark-layout .rents-docs-table thead th {
  color: rgba(255, 255, 255, 0.92) !important;
  background-color: #1b1b1b !important;
}
body.dark-layout .rents-docs-table tbody tr:hover td {
  background-color: #282727 !important;
}
</style>
